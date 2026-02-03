import { Component, OnInit } from '@angular/core';
import { GadgetService } from '../gadget.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-gadget-list',
  imports: [NgFor,FormsModule, NgxPaginationModule],
  templateUrl: './gadget-list.component.html',
  styleUrl: './gadget-list.component.css'
})
export class GadgetListComponent implements OnInit {
  gadgets: any[] = [];
  selectedGadgets: any[] = [];
  selectedGadget: any = { name: '', price: 0, quantity: 0 };

  bulkUpdateData: any = { price: null, quantity: null }; 
  modalMode: 'add' | 'edit' | 'bulk' = 'add'; 


  page: number = 1; // Current page
  itemsPerPage = 5; // Items per page

  constructor(private gadgetService: GadgetService, private modalService: NgbModal) {}

  ngOnInit() {
    this.fetchGadgets();
  }

  fetchGadgets() {
    this.gadgetService.getAllGadgets().subscribe(data => this.gadgets = data);
  }

  openModal(modal: any, gadget: any = null) {
    this.selectedGadget = gadget ? { ...gadget } : { name: '', price: 0, quantity: 0 };
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }

  saveGadget(modal: any) {
    if (this.selectedGadget.id) {
      // Update gadget
      this.gadgetService.updateGadget(this.selectedGadget.id, this.selectedGadget).subscribe(() => {
        this.fetchGadgets();
        modal.dismiss();
      });
    } else {
      // Create new gadget
      this.gadgetService.createGadget(this.selectedGadget).subscribe(() => {
        this.fetchGadgets();
        modal.dismiss();
      });
    }
  }

  deleteGadget(id: number) {
    this.gadgetService.deleteGadget(id).subscribe(() => this.fetchGadgets());
  }

  editGadget(gadget: any, modal: any): void {
    this.selectedGadget = { ...gadget };
    this.openModal(modal, gadget);
  }
  
  // Bulk Delete
  bulkDelete() {
    const ids = this.selectedGadgets.map(gadget => gadget.id);
    this.gadgetService.bulkDeleteGadgets(ids).subscribe(() => {
      this.fetchGadgets();
      this.selectedGadgets = [];
    });
  }

  // Bulk Update
  bulkUpdate(modal: any) {
    this.bulkUpdateData = { price: null, quantity: null }; // Reset bulk update data
    this.modalService.open(modal, { centered: true, size: 'lg' });
  }

  saveBulkUpdate(modal: any) {
    const updatedGadgets = this.selectedGadgets.map(gadget => ({
      ...gadget,
      price: this.bulkUpdateData.price !== null ? this.bulkUpdateData.price : gadget.price,
      quantity: this.bulkUpdateData.quantity !== null ? this.bulkUpdateData.quantity : gadget.quantity
    }));

    this.gadgetService.bulkUpdateGadgets(updatedGadgets).subscribe(() => {
      this.fetchGadgets();
      this.selectedGadgets = [];
      modal.dismiss();
    });
  }

  // Checkbox Logic
  toggleAllSelection(event: any) {
    const isChecked = event.target.checked;
    this.gadgets.forEach(gadget => gadget.selected = isChecked);
    this.updateSelectedGadgets();
  }

  updateSelectedGadgets() {
    this.selectedGadgets = this.gadgets.filter(gadget => gadget.selected);
  }
 

}
