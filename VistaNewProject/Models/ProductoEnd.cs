namespace VistaNewProject.Models
{
    public class ProductoEnd
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; }
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }
    }
}
