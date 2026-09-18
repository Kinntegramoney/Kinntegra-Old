const msSql = require("mssql");
const xlsx = require('xlsx');
const cryptoEngine = require("../models/cryptoengine.model");

exports.GetBankList = async (req, res) => {
    try {
        var dataList = [];

        const readRequest = req.app.locals.db.request();
        const readResult = await readRequest.execute("GetBanks");
        if (readResult.recordset.length > 0) {
            dataList = readResult.recordset;
        }

        var data = [];
        if (dataList.length > 0) {
            for (let i = 0; i < dataList.length; i++) {
                let dataItem = {
                    Id: cryptoEngine.ParamEncrypt(dataList[i].Id, true),
                    Name: dataList[i].Name,
                    IFSC: dataList[i].IFSC,
                    MICRCode: dataList[i].MICRCode,
                    Branch: dataList[i].Branch,
                    Address: dataList[i].Address,
                    Contact: dataList[i].Contact,
                    City: dataList[i].City,
                    District: dataList[i].District,
                    State: dataList[i].State,
                    BSEMode: dataList[i].BSEMode,
                    BSECode: dataList[i].BSECode,
                    RBIId: dataList[i].RBIId,
                    Created: dataList[i].Created,
                    Modified: dataList[i].Modified
                };
                data.push(dataItem)
            }
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.GetBankById = async (req, res) => {
    const Id = req.params.Id;

    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("Id", cryptoEngine.ParamDecrypt(Id, true));
        const readResult = await readRequest.execute("GetBankById");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }

        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                Name: dataItem.Name,
                IFSC: dataItem.IFSC,
                MICRCode: dataItem.MICRCode,
                Branch: dataItem.Branch,
                Address: dataItem.Address,
                Contact: dataItem.Contact,
                City: dataItem.City,
                District: dataItem.District,
                State: dataItem.State,
                BSEMode: dataItem.BSEMode,
                BSECode: dataItem.BSECode,
                RBIId: dataItem.RBIId,
                Created: dataItem.Created,
                Modified: dataItem.Modified
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};


exports.GetBankByIfsc = async (req, res) => {
    const Ifsc = req.params.Ifsc;


    try {
        var dataItem;

        const readRequest = req.app.locals.db.request();
        readRequest.input("IFSC", Ifsc.toUpperCase());
        const readResult = await readRequest.execute("GetBankByIFSC");
        if (readResult.recordset.length > 0) {
            dataItem = readResult.recordset[0];
        }


        var data;
        if (dataItem != null) {
            data = {
                Id: cryptoEngine.ParamEncrypt(dataItem.Id, true),
                Name: dataItem.Name,
                IFSC: dataItem.IFSC,
                MICRCode: dataItem.MICRCode,
                Branch: dataItem.Branch,
                Address: dataItem.Address,
                Contact: dataItem.Contact,
                City: dataItem.City,
                District: dataItem.District,
                State: dataItem.State,
                BSEMode: dataItem.BSEMode,
                BSECode: dataItem.BSECode,
                RBIId: dataItem.RBIId,
                Created: dataItem.Created,
                Modified: dataItem.Modified
            };
        }
        res.status(200).send({ Status: true, Message: "", Data: data });
    }
    catch (err) {
        console.log(err);
        res.status(500).send(errorMessage);
    }
};

exports.SaveBank = async (req, res) => {
    var { Id, Name, IFSC, MICRCode, Branch, Address, Contact, City, District, State, BSEMode, BSECode } = req.body;

    var errorMessage = "Error while saving bank data...";

    // let TransactionMode = (cryptoEngine.ParamDecrypt(Id, true) == 0) ? 'Create' : 'Edit';


    const transaction = req.app.locals.db.transaction();
    try {
        await transaction.begin();

        if (cryptoEngine.ParamDecrypt(Id, true) == 0) {
            const request = transaction.request();
            request.output("Id", msSql.BigInt)
                .input("Name", Name)
                .input("IFSC", IFSC.toUpperCase())
                .input("MICRCode", MICRCode)
                .input("Branch", Branch)
                .input("Address", Address)
                .input("Contact", Contact)
                .input("City", City)
                .input("District", District)
                .input("State", State)
                .input("BSEMode", BSEMode)
                .input("BSECode", BSECode)
                .input("RBIId", '')
            const result = await request.execute("InsertBank");
            Id = cryptoEngine.ParamEncrypt(result.output.Id, true);
        }
        else {
            const request = transaction.request();
            request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
                .input("Name", Name)
                .input("IFSC", IFSC.toUpperCase())
                .input("MICRCode", MICRCode)
                .input("Branch", Branch)
                .input("Address", Address)
                .input("Contact", Contact)
                .input("City", City)
                .input("District", District)
                .input("State", State)
                .input("BSEMode", BSEMode)
                .input("BSECode", BSECode)
                .input("RBIId", '')
            const result = await request.execute("UpdateBank");
        }
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Bank',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);
        res.status(200).send({ Status: true, Message: "Bank Saved Successfully.", Data: { Id: Id } });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("UK_")) { errorMessage = "Duplicate record. Record already exists."; }

        res.status(500).send(errorMessage);
    }
};

exports.DeleteBank = async (req, res) => {
    var { Id } = req.body;


    var errorMessage = "Error while deleting bank data...";

    // let TransactionMode = 'Delete';

    const transaction = req.app.locals.db.transaction();

    try {
        await transaction.begin();

        const request = transaction.request();

        request.input("Id", cryptoEngine.ParamDecrypt(Id, true))
        const result = await request.execute("DeleteBank");
        await transaction.commit();

        // let activityData = {
        //     Id: '414E2B5048745659672B513D',
        //     TransactionId: Id,
        //     TransactionType: 'Bank',
        //     Status: TransactionMode,
        //     Description: ''
        // };

        // var activityId = await activityLogController.CreateActivityLog(req, res, activityData);

        res.status(200).send({ Status: true, Message: "Bank Deleted Successfully.", Data: {} });
    }
    catch (err) {
        console.log(err);
        try {
            await transaction.rollback();
        } catch (sqlerr) {
            console.log(sqlerr);
        }

        if (err.message.includes("FK_")) { errorMessage = "Reference exists. Cannot delete record."; }

        // console.log(errorMessage);

        res.status(500).send(errorMessage);
    }
};

exports.UploadExcel = async (req, res) => {
    const errorMessage = 'Error while uploading...';
    const workBook = xlsx.read(req.files.documentFile.data);
    const workSheet = workBook.Sheets[workBook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(workSheet);
    const transaction = req.app.locals.db.transaction();
    try {
        for (const row of jsonData) {
            let bankName = row['Name'] || '';
            let sr_no = row['Id'] || 0;
            let ifsc = row['IFSC'] || '';
            let micr_code = row['MICRCode'] || '';
            let branchName = row['Branch'] || '';
            let address = row['Address'] || '';
            let phone = row['Contact'] || '';
            let city = row['City'] || '';
            let district = row['District'] || '';
            let state = row['State'] || '';
            // let stdCode = row['STD CODE'];
            let bse_mode = row['BSEMode'] || '';
            let bse_code = row['BSECode'] || '';
            let rbi_id = row['RBIId'] || '';
            let isCooperative = row['IsCooperative'] || false;

            try {
                await transaction.begin();

                const request = transaction.request();
                request.input("Name", bankName)
                    .input("IFSC", ifsc)
                    .input("MICRCode", micr_code)
                    .input("Branch", branchName)
                    .input("Address", address)
                    .input("Contact", phone)
                    .input("City", city)
                    .input("District", district)
                    .input("State", state)
                    .input("BSEMode", bse_mode)
                    .input("BSECode", bse_code)
                    .input("RBIId", rbi_id)
                    .input("IsCooperative", isCooperative);
                const result = await request.execute("ImportBank");

                await transaction.commit();
            }
            catch (err) {
                console.log(err);
                try {
                    await transaction.rollback();
                } catch (sqlerr) {
                    console.log(sqlerr);
                }

                if (err.message.includes("UK_")) {
                    errorMessage = "Duplicate record. Record already exists.";
                }
            }
        }
        res.status(200).send({
            Status: true,
            Message: "File Uploaded successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            Message: errorMessage,
        });
    }
};
