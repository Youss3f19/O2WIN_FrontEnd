import { Component, inject } from '@angular/core';
import { CommandesService } from '../../../services/commandes.service';
import { Commande } from '../../../models/commande';
import { HttpHeaders } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [NgClass , FormsModule],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css',
})
export class OrderTableComponent {
  private readonly commandeService: CommandesService = inject(CommandesService);

  commandes!: Commande[];
  filteredCommandes!: Commande[];

  statusFilter: string = '';
  userFilter: string = '';

  ngOnInit(): void {
    this.loadCommands();
  }

  loadCommands(): void {
    this.commandeService.getCommandes().subscribe((commandes) => {
      this.commandes = commandes;
      this.applyFilters(); 
    });
  }

  applyFilters(): void {
    this.filteredCommandes = this.commandes.filter((commande) => {
      const matchesStatus =
        !this.statusFilter || commande.status === this.statusFilter;
      const matchesUser =
        !this.userFilter ||
        `${commande.user.name} ${commande.user.lastname}`
          .toLowerCase()
          .includes(this.userFilter.toLowerCase());
      return matchesStatus && matchesUser;
    });
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  updateCommandStatus(commandId: string, status: string): void {
    const headers = this.getHeaders();
    this.commandeService.updateCommandStatus(commandId, status, headers).subscribe(() => {
      this.loadCommands();
    });
  }

  trackById(index: number, item: Commande): string {
    return item._id; // Assuming each Commande has a unique _id
  }
}
