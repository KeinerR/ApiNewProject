using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;
namespace VistaNewProject.Models
{
    public class PresentacionUpdate
    {
        public int PresentacionId { get; set; }
        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombrePresentacion { get; set; }
        public string? DescripcionPresentacion { get; set; }
        [Required(ErrorMessage = "El contenido es obligatorio.")]
        [MinLength(2, ErrorMessage = "El contenido debe tener al menos 2 caracteres.")]
        public string? Contenido { get; set; }
        [Required(ErrorMessage = "La cantidad por presentación es obligatoria.")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad por presentación debe ser mayor que 0.")]
        public int? CantidadPorPresentacion { get; set; }
        public ulong? EstadoPresentacion { get; set; }

    }
}
