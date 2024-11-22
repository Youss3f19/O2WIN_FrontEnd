import { Component, inject } from '@angular/core';
import { CommandesService } from '../../../services/commandes.service';
import { Commande } from '../../../models/commande';

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
    this.commandeService.getCommandes().subscribe((commandes) => {
      this.commandes = commandes;
    });
  }
}
