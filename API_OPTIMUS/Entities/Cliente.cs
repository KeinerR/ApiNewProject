using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace API_OPTIMUS.Entities;

public partial class Cliente
{
    public int ClienteId { get; set; }

    public string? Identificacion { get; set; }

    public string? NombreEntidad { get; set; }

    public string? NombreCompleto { get; set; }

    public string? TipoCliente { get; set; }

    public string? Telefono { get; set; }

    public string? Correo { get; set; }

    public string? Direccion { get; set; }

    public ulong? EstadoCliente { get; set; }

    [JsonIgnore]
    public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
