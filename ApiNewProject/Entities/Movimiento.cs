using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class Movimiento
    {
        public int MovimientoId { get; set; }
        public string? TipoAccion { get; set; }
        public string? TipoMovimiento { get; set; }
        public int? BuscarId { get; set; } = 0;
       
        public DateTime? FechaMovimiento { get; set; }
     
    }
}
