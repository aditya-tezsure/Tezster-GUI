import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { AppService } from '../app.service';
import { CreateWalletComponent } from '../create-wallet/create-wallet.component';
import { RestoreWalletComponent } from '../restore-wallet/restore-wallet.component';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
declare var eztz: any;

@Component({
	selector: 'app-accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

	public configData = null;
	public acc=[];
	balance: any;
	constructor(private _AppService: AppService,private modalService: ModalService) { }
	create(): void {    
		this.modalService.openModal('create', CreateWalletComponent);
	}
	restore(): void {
		this.modalService.openModal('restore', RestoreWalletComponent);
	}

	ngOnInit() {    
		this._AppService.configDataChangeObs$
		.subscribe(data => {
			if (data) {
			this.configData = data;          
			eztz.node.setProvider(this.configData.provider);
			for(var accounts of this.configData.accounts){            
				this.acc.push({
				"label" :accounts.label,
				"address" : accounts.pkh,
				"balance" : this.getBalance(accounts.pkh),
				"txc" :0,
				"index" :0,
				"sec":accounts.pkh              
				}); 
			}          
			}
		});      
	}
	async getBalance(pkh: any) {       
		this.balance= await this._AppService.getBalance(pkh);      
		return this.balance;       
	}
	  
}

