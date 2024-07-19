using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;


namespace API_OPTIMUS.Entities;

public partial class Compra
{
    public int CompraId { get; set; }

    public int? ProveedorId { get; set; }

    public string? NumeroFactura { get; set; }

    public DateTime? FechaCompra { get; set; }

    public long? ValorTotalCompra { get; set; }

    public ulong? EstadoCompra { get; set; }

    public virtual ICollection<Detallecompra>? Detallecompras { get; set; }
    [JsonIgnore]

    public virtual Proveedor? Proveedor { get; set; }
}

public partial class Detallecompra
{
    public Detallecompra()
    {
        Lotes = new HashSet<Lote>();
    }

    public int? DetalleCompraId { get; set; }
    public int? CompraId { get; set; }

    [JsonIgnore]
    public virtual Compra? Compra { get; set; }
    public virtual ICollection<Lote> Lotes { get; set; }
}
public class FacturaDTO
{
    public string? NumeroFactura { get; set; }
}

public class LoteDTO
{
    public string? NumeroLote { get; set; }
}
