// external dependecies
import { Button, Dialog, DialogContent, DialogTitle, Fab } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { useState, useEffect } from 'react';

// internal dependecies
import { postRequestWithFetch } from '../../service';
import { notifyError, notifySuccess } from '../../components/notify/Notify';
import AddPrizeFields from './AddPrizeFields';


// dialog for adding a record of prize in database
export default function AddPrize(props) {

    useEffect(function () {
        fetchClickedPrize();
        // eslint-disable-next-line
    }, [props.eventId, props.open]);

    const [prizeList, setPrizeList] = useState([]);

    const fetchClickedPrize = async () => {
        const body = {
            ppmDreamNiftyId: props.eventId,
            prizeId: props.prizeId
        };
        const data = await postRequestWithFetch("dreamNifty/prizeList", body);
        if (data.success) {
            const finalData = data.data.map(function (item) {
                item.memberError = '';
                item.percentageError = '';
                item.priorityError = '';
                return item
            })
            setPrizeList(finalData);
        }
    }

    const handleSubmit = () => {

        let err = false; // error variable to manage all the fields should be provided
        let totalPercentageDistribution = 0;

        const updatedPrizeList = prizeList.map(function (prize) {
            if (prize.participant === "") {
                prize.memberError = "Number of members should be provided";
                err = true;
            } else if (Number(prize.participant) === 0) {
                prize.memberError = "Number of members can't be 0";
                err = true;
            }
            else {
                prize.memberError = '';
            }

            if (prize.percentDistribution === "") {
                prize.percentageError = "Percentage should be provided";
                err = true;
            } else if (Number(prize.percentDistribution) === 0) {
                prize.percentageError = "Percentage can't be 0";
                err = true;
            }
            else {
                prize.percentageError = "";
            }

            if (prize.priority === "") {
                prize.priorityError = "Priority should be provided";
                err = true;
            } else if (Number(prize.priority) === 0) {
                prize.priorityError = "Priority can't be 0";
                err = true;
            }
            else {
                prize.priorityError = "";
            }
            totalPercentageDistribution += Number(prize.percentDistribution);
            return prize;
        })
        setPrizeList(updatedPrizeList);

        if (!err) {
            if (totalPercentageDistribution !== 100) {
                notifyError({ Message: "Total Percentage distribution of prize is " + totalPercentageDistribution + "% it should be equal to 100", ProgressBarHide: true });
            } else {
                prizeList.forEach(async function (prize, index) {
                    if (props.prizeDistribution[index] && props.prizeDistribution[index].id === prize.id) {
                        const body = {
                            priority: prize.priority,
                            participant: prize.participant,
                            percentDistribution: prize.percentDistribution,
                            ppmDreamNiftyId: props.eventId,
                            prizeId: prize.id
                        }
                        const data = await postRequestWithFetch("dreamNifty/prize/edit", body);
                        if (data.success) {
                            notifySuccess({ Message: "Record updated successfully", ProgressBarHide: true });
                            props.fetchPrizeDistribution();
                            props.setOpen(false);
                        } else {
                            notifyError({ Message: "OOps some error occured", ProgressBarHide: true });
                        }
                    } else {
                        const body = {
                            priority: prize.priority,
                            participant: prize.participant,
                            percentDistribution: prize.percentDistribution,
                            ppmDreamNiftyId: props.eventId
                        }
                        const data = await postRequestWithFetch("dreamNifty/prize/add", body);
                        if (data.success) {
                            notifySuccess({ Message: "Record inserted successfully", ProgressBarHide: true });
                            props.fetchPrizeDistribution();
                            props.setOpen(false);
                        } else {
                            notifyError({ Message: "OOps some error occured", ProgressBarHide: true });
                        }
                    }
                })
            }
        }
    }

    const setMember = (value, count) => {
        const newPrizeList = prizeList.map(function (item, index) {
            if (count - 1 === index) {
                item.participant = value;
            }
            return item;
        })
        setPrizeList(newPrizeList);
    }

    const setPercentage = (value, count) => {
        const newPrizeList = prizeList.map(function (item, index) {
            if (count - 1 === index) {
                item.percentDistribution = value;
            }
            return item;
        })
        setPrizeList(newPrizeList);
    }

    const setPriority = (value, count) => {
        const newPrizeList = prizeList.map(function (item, index) {
            if (count - 1 === index) {
                item.priority = value;
            }
            return item;
        })
        setPrizeList(newPrizeList);
    }

    const handleAddPrize = () => {
        setPrizeList(
            [...prizeList,
            {
                memberError: '',
                percentageError: '',
                priorityError: '',
                priority: '',
                participant: '',
                percentDistribution: ''
            }
            ]
        )
    }

    const handleRemovePrize = async(count) => {
        if (props.prizeDistribution[count - 1] && props.prizeDistribution[count - 1].id === prizeList[count - 1].id) {
            const body = {id: prizeList[count - 1].id}
            await postRequestWithFetch("dreamNifty/prize/delete", body);
            fetchClickedPrize();
        } else {
            const updatedPrizeList = prizeList.filter((item, index) => {
                return index !== count - 1;
            })
            setPrizeList(updatedPrizeList);
        }
    }

    return <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        aria-labelledby="responsive-dialog-title"
    >
        <DialogTitle>
            <div>Add New</div>
            <div>
                <Fab size="small" style={{ background: "white" }} aria-label="add">
                    <CloseIcon onClick={() => props.setOpen(false)} />
                </Fab>
            </div>
        </DialogTitle>
        <DialogContent >
            <div style={{ minHeight: 200, minWidth: 300 }}>
                {
                    prizeList.map((prize, index) => {
                        return <div key={index}>
                            <AddPrizeFields
                                count={index + 1}
                                member={prize.participant}
                                percentage={prize.percentDistribution}
                                priority={prize.priority}
                                setMember={setMember}
                                setPercentage={setPercentage}
                                setPriority={setPriority}
                                memberError={prize.memberError}
                                percentageError={prize.percentageError}
                                priorityError={prize.priorityError}
                                handleRemovePrize={handleRemovePrize}
                            />
                        </div>
                    })
                }
            </div>
            <div>
                <Button fullWidth color='primary' variant='contained' onClick={handleSubmit}>Submit</Button>
            </div>
            <Fab onClick={handleAddPrize} color="secondary" style={{ position: 'absolute', bottom: 10, right: 10 }}>
                <AddIcon />
            </Fab>
        </DialogContent>
    </Dialog>
}