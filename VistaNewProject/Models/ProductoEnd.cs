using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;
namespace VistaNewProject.Models
{
    public class ProductoEnd
    {
        public int ProductoId { get; set; }
        [Required(ErrorMessage = "El nombre de la presentacion es obligatorio.")]
        public int? PresentacionId { get; set; }
        [Required(ErrorMessage = "El nombre de la marca es obligatorio.")]
        public int? MarcaId { get; set; }
        [Required(ErrorMessage = "El nombre de la categorìa es obligatorio.")]
        public int? CategoriaId { get; set; }
        [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; }
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }
    }
}
