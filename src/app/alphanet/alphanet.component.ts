import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { AppService } from '../app.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalService } from '../modal.service';
declare var eztz: any;
@Component({
  selector: 'app-alphanet',
  templateUrl: './alphanet.component.html',
  styleUrls: ['./alphanet.component.css']
})
export class AlphanetComponent implements OnInit {
  	public userData = " https://tezos-dev.cryptonomic-infra.tech/";
  	public configData = [];
  	constructor(public bsModalRef: BsModalRef, private _AppService: AppService, private modalService: ModalService) { }

	onClick(): void {
    	eztz.node.setProvider(this.userData);
		this._AppService.setProviderData(this.userData);
		this.modalService.closeModal('alphanet');
		window.location.reload();
	}

	onNoClick(): void {
		this.modalService.closeModal('alphanet');
	}

	ngOnInit() {

		this._AppService.configDataChangeObs$
		.subscribe(data => {
			if (data) {
			this.configData = data;
			}
		});
	}
}
