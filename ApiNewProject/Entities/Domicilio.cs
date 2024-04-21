using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
namespace ApiNewProject.Entities
{
    public partial class Domicilio
    {
        public int DomicilioId { get; set; }
        public int? PedidoId { get; set; }
        public int? UsuarioId { get; set; }
        public string? Observacion { get; set; }
        public DateTime? FechaEntrega { get; set; }
        public string? DireccionDomiciliario { get; set; }
        public string? EstadoDomicilio { get; set; }
        [JsonIgnore]

        public virtual Pedido? Pedido { get; set; }
        [JsonIgnore]

        public virtual Usuario? Usuario { get; set; }
    }
}
