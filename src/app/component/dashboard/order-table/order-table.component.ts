import { Component, inject } from '@angular/core';
import { CommandesService } from '../../../services/commandes.service';
import { Commande } from '../../../models/commande';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {
  private readonly commandeService: CommandesService = inject(CommandesService)

  commandes!: Commande[];
  ngOnInit(): void {
    this.loadCommands();
  }
  loadCommands(): void {
    this.commandeService.getCommandes().subscribe((commandes) => {
      this.commandes = commandes;
    });
  }
  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  updateCommandStatus(commadId : string , status : string ){
    const heades = this.getHeaders()
    this.commandeService.updateCommandStatus(commadId,status,heades).subscribe(
      (res) => {
        console.log(res);
        this.loadCommands();
    });

    }
}
