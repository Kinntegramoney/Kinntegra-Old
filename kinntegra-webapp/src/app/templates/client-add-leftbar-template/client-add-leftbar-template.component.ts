import { Component,EventEmitter, Output} from '@angular/core';
import { ClientService } from '../../services/client.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppGlobalService } from '../../services/app-global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-add-leftbar-template',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './client-add-leftbar-template.component.html',
  styleUrl: './client-add-leftbar-template.component.scss',
  providers: [ClientService]
})
export class ClientAddLeftbarTemplateComponent {
   @Output() clientProfileData = new EventEmitter<any>();
 // @Output() passEntry: EventEmitter<any> = new EventEmitter();
  objClientAccounts: any = [];
  objClients: any = [];
  objClientAccountProfile:any = [];
  AssociateId: any;
  objName: string = '';
  originalClientAccounts: any[] | null = null; 



  constructor(
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.AssociateId = AppGlobalService.CurrentAssociate;
    this.onRefresh();
  }

  onRefresh() {
    this.getClientAccountListByAssociateId();
  }

  getClientAccountListByAssociateId() {
    this.clientService.GetAssociateClientAccountList(this.AssociateId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientAccounts = result.Data;
        this.objClients= result.Data;
      
    
      }
    });
  }

  getClientAccountProfile(ClientAccountId: any) {
    this.clientService.GetClientAccountDetails(ClientAccountId).subscribe((result) => {
      if (result.Status == true) {
        this.objClientAccountProfile = result.Data;
        this.clientProfileData.emit(this.objClientAccountProfile); 
        
      }
    });
  }

  getClientDetails(clientDetails: any) {

    this.getClientAccountProfile(clientDetails.ClientAccountId)
  }

  onAddClient(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['leads']);
  }


  searchClientRecord(): void {
    let filterResult = this.objClients;

    filterResult = filterResult.filter((res: any) => {
      return res.FirstAccountHolderName.toLowerCase().match(this.objName.toLowerCase().trim()) ||
        res.UCC.toLowerCase().match(this.objName.toLowerCase().trim());
    });

    this.objClientAccounts = [...filterResult];
  
  }
}