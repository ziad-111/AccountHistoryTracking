import { LightningElement, wire, track, api } from 'lwc';
import getAccountHistoryData from '@salesforce/apex/SM_FieldHistoryTracking.getAccountHistoryData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class AccountHistoryTable extends LightningElement {

    

    columns = [ 
        { label: 'Field Name', fieldName: 'fieldName', type: 'text' },
        { label: 'Modified By', fieldName: 'LastModifiedById', type: 'text' },       
        { label: 'Original value', fieldName: 'oldValue', type: 'text' },
        { label: 'New value', fieldName: 'newValue', type: 'text' }
    ];
     @track accountHistoryData = [];
     @track data = [];
     //@track data = [];
     @track page = 1;
     //toutes les données de l'historique des comptes récupérées depuis Apex.
     @track items = [];
     //l'enregistrement de départ à afficher lors de la pagination.
     @track startingRecord = 1;
     @track endingRecord = 0;
     //nbr d'enregestriment à affciher
     @track pageSize = 5;
     //total d'enregistrement reçu par apex
     @track totalRecountCount = 0;
     @track totalPage = 0; 
     
     
    
     @wire(getAccountHistoryData)
     wiredAccountHistory({ error, data }) {
         if (data) {
            
             this.data = data.map(record => ({
                 FieldName: record.fieldName,
                 Originalvalue: record.oldValue,
                 Newvalue: record.newValue,
                 LastModifiedById: record.LastModifiedById,
             }));          
             
             
             this.items = data;
             this.totalRecountCount = data.length; 
             this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);                    
             this.data = this.items.slice(0,this.pageSize); 
             this.endingRecord = this.pageSize;
             console.log('Total Record Count:', this.totalRecountCount);
             console.log('Data : ', data);
             //console.log('items : ', this.items);
             console.log('pageSize : ', this.pageSize);
             console.log('Page Number : ', this.totalPage);
             console.log('Starting Record : ', this.startingRecord);
             console.log('Endig Record : ', this.endingRecord);
             
             
         } else if (error) {
             this.error = error;
             this.data = undefined;
             this.showToast('Error retrieving data', 'error');
         }
     }
     displayRecordPerPage(page){        
        this.startingRecord = (page - 1)*this.pageSize;
        this.endingRecord = page * this.pageSize;
        this.endingRecord = (this.endingRecord > this.totalRecountCount)?this.totalRecountCount:this.endingRecord;
        this.data = this.items.slice(this.startingRecord, this.endingRecord);        
        this.startingRecord = this.startingRecord + 1;
        console.log('page:', this.page);
        console.log('accountHistoryData', this.accountHistoryData);
        console.log('displayRecordPerPage:', this.displayRecordPerPage);
        
    }
    
    
nextHandler(){
    if(this.page <this.totalPage && this.page !==this.totalPage){
        this.page = this.page + 1;
        this.displayRecordPerPage(this.page);
    }
            }
    
    previousHandler(){
        if(this.page > 1){
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
                }
 
     showToast(message, variant) {
         const event = new ShowToastEvent({
             title: 'Error',
             message: message,
             variant: variant,
             mode: 'dismissable'
         });
         this.dispatchEvent(event);
     }
}
