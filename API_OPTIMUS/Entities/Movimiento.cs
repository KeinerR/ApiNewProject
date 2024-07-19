using System;
using System.Collections.Generic;

namespace API_OPTIMUS.Entities;

public partial class Movimiento
{
    public int MovimientoId { get; set; }

    public string? TipoAccion { get; set; }

    public string? TipoMovimiento { get; set; }

    public int? BuscarId { get; set; }

    public DateTime? FechaMovimiento { get; set; }
}
