import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { promise } from 'protractor';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExcelService {
    arrayBuffer: any;
    file: File;


    constructor(private datePipe: DatePipe, private httpClient: HttpClient) { }

    public exportAsExcelFile(json: any[], excelFileName: string): void {

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        console.log('worksheet', worksheet);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        const currentDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyHHmmss');
        FileSaver.saveAs(data, fileName + '_' + currentDateTime + EXCEL_EXTENSION);
    }

    public exportTableToExcel(table: any, excelFileName: string): void {
        // converts a DOM TABLE element to a worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // /* save to file */s
        const currentDateTime = this.datePipe.transform(new Date(), 'ddMMyyyyHHmmss');
        XLSX.writeFile(wb, excelFileName + '_' + currentDateTime + EXCEL_EXTENSION);
    }

    excelCatalogue(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.httpClient.get('../../assets/Catalogue_Dump_Data.xlsx', { responseType: 'blob' })
                .subscribe((data: any) => {
                    let fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        this.arrayBuffer = fileReader.result;
                        var data = new Uint8Array(this.arrayBuffer);
                        var arr = new Array();
                        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                        var bstr = arr.join("");
                        var workbook = XLSX.read(bstr, { type: "binary" });
                        var first_sheet_name = workbook.SheetNames[0];
                        var worksheet = workbook.Sheets[first_sheet_name];
                        console.log("Shee", XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                        resolve(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                    }
                    fileReader.readAsArrayBuffer(data);
                }, (Err: any) => {
                    reject(Err)
                });
        })
    }
    public Upload() {
        this.httpClient.get('../../assets/Catalogue_Dump_Data.xlsx', { responseType: 'blob' })
            .subscribe((data: any) => {
                let fileReader = new FileReader();
                fileReader.onload = (e) => {
                    this.arrayBuffer = fileReader.result;
                    var data = new Uint8Array(this.arrayBuffer);
                    var arr = new Array();
                    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                    var bstr = arr.join("");
                    var workbook = XLSX.read(bstr, { type: "binary" });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];
                    console.log("Shee", XLSX.utils.sheet_to_json(worksheet, { raw: true }));
                    return XLSX.utils.sheet_to_json(worksheet, { raw: true });
                }
                fileReader.readAsArrayBuffer(data);
            });
    }

}