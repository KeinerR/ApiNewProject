namespace VistaNewProject.Models
{
    public class Producto
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; } = 0;
        public int? CantidadReservada { get; set; } = 0;
        public int? CantidadPorPresentacion { get; set; }
        public string? NombreCompleto { get; set; }
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public string? NombrePresentacion { get; set; }
        public string ?NombreMarca { get; set; }
        public string ?NombreCategoria { get; set; }
        public string? Contenido { get; set; }
        public ulong? Estado { get; set; }
        public int CantidadTotalPorUnidad => CantidadTotal * CantidadPorPresentacion ?? 0;
        public virtual Categoria? Categoria { get; set; }
        public virtual Marca? Marca { get; set; } 
        public virtual Presentacion? Presentacion { get; set; }
        public virtual Unidad? Unidad { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
        public virtual ICollection<Movimiento> Movimientos { get; set; }
    }
}
