import { Box, TextField, Button } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import MUIDataTable from "mui-datatables";
import { getRequestWithFetch, postRequestWithFetch } from "../../service";

export default function AddFeature() {

    const [rows, setRows] = useState([]);
    const [featureName, setFeatureName] = useState('');

    useEffect(() => {
        handleList();
    }, [])

    const handleList = async () => {
        const res = await getRequestWithFetch("plans/featureList");
        setRows(res.data)
    }

    console.log(rows);

    const handleAdd = async () => {
        const body = {
            featureName: featureName
        }
        await postRequestWithFetch("plans/addFeature", body)
        setFeatureName('');
        handleList();
    }

    const columns = ["index", "Feature Name", "Status", "CreatedAt", "UpdatedAt"];

    const data = rows.map((row, index) => {
        if (!row.length) {
            return [
                index + 1,
                row.featureName,
                row.status,
                row.createdAt.split('T')[0],
                row.updatedAt.split('T')[0]
            ]
        } else {
            return [
                <font color='red'>OOPS! No Data Found</font>
            ]
        }

    })

    const options = {
        filterType: 'checkbox',
    };

    return (
        <>
            <Box component="span" style={{ padding: "1rem", margin: 'auto' }}>
                <div>
                    <form>
                        <div>
                            <TextField onChange={(e) => setFeatureName(e.target.value)} value={featureName} id="outlined-basic" label="Feature Name" style={{ width: '30rem', }} variant="outlined" />
                            <Button onClick={() => handleAdd()} variant="contained" color="primary" style={{ height: '55px', borderRadius: '0px' }}>
                                Add Feature
                            </Button>
                        </div>
                    </form>
                </div>
            </Box>
            <Box component="span" style={{ marginTop: '0%', padding: "1rem", margin: 'auto' }}>
                <MUIDataTable
                    title={"Plan List"}
                    data={data}
                    columns={columns}
                    options={options}
                />
            </Box>
        </>
    )
}