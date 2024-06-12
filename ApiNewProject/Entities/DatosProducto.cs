namespace ApiNewProject.Entities
{
    public class DatosProducto
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; } = 0;
        public int? CantidadReservada { get; set; } = 0;
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public string? NombreMarca { get; set; }
        public string? NombreCategoria { get; set; }
        public string? NombrePresentacion { get; set; }
        public string? Contenido { get; set; }
        public int? CantidadPorPresentacion { get; set; }
        public ulong? Estado { get; set; }

    }
}
