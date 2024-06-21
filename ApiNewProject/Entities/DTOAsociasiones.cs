using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace ApiNewProject.Entities
{
    public partial class CategoriaxMarcaAsosiacion
    {
        public int CategoriaId { get; set; }
        public int MarcaId { get; set; }

    }
    public partial class CategoriaxMarca
    {
        public int CategoriaId { get; set; }
        public int MarcaId { get; set; }
        public string? NombreMarca { get; set; }
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }
        public ulong? EstadoMarca { get; set; }

    }

    public partial class CategoriaxPresentacion
    {
        public int CategoriaId { get; set; }
        public int PresentacionId { get; set; }
        public string? NombreCategoria { get; set; }
        public string? NombrePresentacion { get; set; }
        public string? Contenido { get; set; }
        public int? CantidadPorPresentacion { get; set; }
        public ulong? EstadoPresentacion { get; set; }
        public ulong? EstadoCategoria { get; set; }


    }

    public partial class CategoriaxPresentacionAsosiacion
    {
        public int CategoriaId { get; set; }
        public int PresentacionId { get; set; }

    }

    public partial class CategoriaxUnidad
    {
        public int CategoriaId { get; set; }
        public int UnidadId { get; set; }
        public string? NombreCategoria { get; set; }
        public string? NombreUnidad { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public ulong? EstadoUnidad { get; set; }
        public ulong? EstadoCategoria { get; set; }
 


    }

    public partial class CategoriaxUnidadAsosiacion
    {
        public int CategoriaId { get; set; }
        public int UnidadId { get; set; }

    }


    public partial class UnidadxProducto
    {
        public int UnidadId { get; set; }
        public int ProductoId { get; set; }
        public string? NombreCompletoUnidad { get; set; }
        public string? NombreCompletoProducto { get; set; }
        public ulong? EstadoProducto { get; set; }

    }


    public partial class UnidadxProductoAsosiacion
    {
        public int UnidadId { get; set; }
        public int ProductoId { get; set; }

    }



}
