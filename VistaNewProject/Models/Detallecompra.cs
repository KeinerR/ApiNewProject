namespace VistaNewProject.Models
{
    public class Detallecompra
    {
        public int DetalleCompraId { get; set; }
        public int? CompraId { get; set; }
        public int? ProductoId { get; set; }
        public int? UnidadId { get; set; }
        public int? Cantidad { get; set; }

        public virtual Compra? Compra { get; set; }
        public virtual Producto? Producto { get; set; }
        public virtual Unidad? Unidad { get; set; }
        public virtual Lote? lote { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
    }
}
