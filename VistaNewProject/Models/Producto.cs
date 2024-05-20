namespace VistaNewProject.Models
{
    public class Producto
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; }
        public string NombreCompleto { get; set; }
        public int CantidadAplicarPorMayor { get; set; }

        public int CantidadPorPresentacion { get; set; }

        public int DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }
        public virtual Categoria? Categoria { get; set; }
        public virtual Marca? Marca { get; set; }
        public virtual Presentacion? Presentacion { get; set; }
        public virtual Unidad? Unidad { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
        public virtual ICollection<Movimiento> Movimientos { get; set; }
    }
}
