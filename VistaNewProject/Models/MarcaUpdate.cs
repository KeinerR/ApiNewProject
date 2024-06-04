using System.ComponentModel.DataAnnotations;

namespace VistaNewProject.Models
{
    public class MarcaUpdate
    {
        public int MarcaId { get; set; }
        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombreMarca { get; set; }

        public ulong? EstadoMarca { get; set; }

    }
}
