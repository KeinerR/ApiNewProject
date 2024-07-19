using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace API_OPTIMUS.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categoria",
                columns: table => new
                {
                    CategoriaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreCategoria = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EstadoCategoria = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.CategoriaID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categoriaxmarca",
                columns: table => new
                {
                    CategoriaID = table.Column<int>(type: "int", nullable: false),
                    MarcaID = table.Column<int>(type: "int", nullable: false),
                    NombreMarca = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreCategoria = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EstadoCategoria = table.Column<ulong>(type: "bit(1)", nullable: true),
                    EstadoMarca = table.Column<ulong>(type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => new { x.CategoriaID, x.MarcaID });
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categoriaxpresentacion",
                columns: table => new
                {
                    CategoriaID = table.Column<int>(type: "int", nullable: false),
                    PresentacionID = table.Column<int>(type: "int", nullable: false),
                    NombreCompletoPresentacion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreCategoria = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombrePresentacion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Contenido = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    CantidadPorPresentacion = table.Column<int>(type: "int", nullable: true),
                    EstadoPresentacion = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'"),
                    EstadoCategoria = table.Column<ulong>(type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => new { x.CategoriaID, x.PresentacionID });
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "categoriaxunidad",
                columns: table => new
                {
                    CategoriaID = table.Column<int>(type: "int", nullable: false),
                    UnidadID = table.Column<int>(type: "int", nullable: false),
                    NombreCategoria = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreUnidad = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    NombreCompletoUnidad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    CantidadPorUnidad = table.Column<int>(type: "int", nullable: true),
                    EstadoUnidad = table.Column<ulong>(type: "bit(1)", nullable: true),
                    EstadoCategoria = table.Column<ulong>(type: "bit(1)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => new { x.CategoriaID, x.UnidadID });
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "cliente",
                columns: table => new
                {
                    ClienteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Identificacion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreEntidad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true, defaultValueSql: "'N/A u No aplica'"),
                    NombreCompleto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    TipoCliente = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Telefono = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    Correo = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Direccion = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true),
                    EstadoCliente = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.ClienteID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "marca",
                columns: table => new
                {
                    MarcaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreMarca = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EstadoMarca = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.MarcaID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "movimientos",
                columns: table => new
                {
                    MovimientoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    TipoAccion = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    TipoMovimiento = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    BuscarID = table.Column<int>(type: "int", nullable: true),
                    FechaMovimiento = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.MovimientoID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "permiso",
                columns: table => new
                {
                    PermisoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombrePermiso = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EstadoPermiso = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.PermisoID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "presentacion",
                columns: table => new
                {
                    PresentacionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombrePresentacion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreCompletoPresentacion = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Contenido = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    CantidadPorPresentacion = table.Column<int>(type: "int", nullable: true),
                    DescripcionPresentacion = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true, defaultValueSql: "'N/A'"),
                    EstadoPresentacion = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.PresentacionID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "proveedor",
                columns: table => new
                {
                    ProveedorID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreEmpresa = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreContacto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Direccion = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true),
                    Telefono = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    Correo = table.Column<string>(type: "varchar(75)", maxLength: 75, nullable: true),
                    EstadoProveedor = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.ProveedorID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "rol",
                columns: table => new
                {
                    RolID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreRol = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EstadoRol = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.RolID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "unidad",
                columns: table => new
                {
                    UnidadID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    NombreUnidad = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    NombreCompletoUnidad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    CantidadPorUnidad = table.Column<int>(type: "int", nullable: true),
                    DescripcionUnidad = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: true, defaultValueSql: "'N/A'"),
                    EstadoUnidad = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.UnidadID);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "unidadxproducto",
                columns: table => new
                {
                    UnidadID = table.Column<int>(type: "int", nullable: false),
                    ProductoID = table.Column<int>(type: "int", nullable: false),
                    NombreCompletoUnidad = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreCompletoProducto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    EstadoProducto = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => new { x.UnidadID, x.ProductoID });
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "pedido",
                columns: table => new
                {
                    PedidoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ClienteID = table.Column<int>(type: "int", nullable: true),
                    TipoServicio = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    FechaPedido = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ValorTotalPedido = table.Column<decimal>(type: "decimal(10,2)", precision: 10, nullable: true),
                    EstadoPedido = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: true, defaultValueSql: "'Pendiente'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.PedidoID);
                    table.ForeignKey(
                        name: "pedido_ibfk_1",
                        column: x => x.ClienteID,
                        principalTable: "cliente",
                        principalColumn: "ClienteID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    ProductoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    PresentacionID = table.Column<int>(type: "int", nullable: true),
                    MarcaID = table.Column<int>(type: "int", nullable: true),
                    CategoriaID = table.Column<int>(type: "int", nullable: true),
                    NombreProducto = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    NombreCompletoProducto = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: true),
                    CantidadTotal = table.Column<int>(type: "int", nullable: true, defaultValueSql: "'0'"),
                    CantidadTotalPorUnidad = table.Column<int>(type: "int", nullable: true, defaultValueSql: "'0'"),
                    CantidadReservada = table.Column<int>(type: "int", nullable: true, defaultValueSql: "'0'"),
                    CantidadPorUnidadReservada = table.Column<int>(type: "int", nullable: true, defaultValueSql: "'0'"),
                    CantidadAplicarPorMayor = table.Column<int>(type: "int", nullable: true, defaultValueSql: "'0'"),
                    DescuentoAplicarPorMayor = table.Column<int>(type: "int", nullable: true, defaultValueSql: "'0'"),
                    AplicarFechaDeVencimiento = table.Column<string>(type: "varchar(2)", maxLength: 2, nullable: true),
                    Estado = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.ProductoID);
                    table.ForeignKey(
                        name: "productos_ibfk_1",
                        column: x => x.PresentacionID,
                        principalTable: "presentacion",
                        principalColumn: "PresentacionID");
                    table.ForeignKey(
                        name: "productos_ibfk_2",
                        column: x => x.MarcaID,
                        principalTable: "marca",
                        principalColumn: "MarcaID");
                    table.ForeignKey(
                        name: "productos_ibfk_3",
                        column: x => x.CategoriaID,
                        principalTable: "categoria",
                        principalColumn: "CategoriaID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "compras",
                columns: table => new
                {
                    CompraID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ProveedorID = table.Column<int>(type: "int", nullable: true),
                    Numero_factura = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    FechaCompra = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    ValorTotalCompra = table.Column<string>(type: "mediumtext", nullable: true),
                    EstadoCompra = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.CompraID);
                    table.ForeignKey(
                        name: "compras_ibfk_1",
                        column: x => x.ProveedorID,
                        principalTable: "proveedor",
                        principalColumn: "ProveedorID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "rolxpermiso",
                columns: table => new
                {
                    RolxPermisoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    PermisoID = table.Column<int>(type: "int", nullable: true),
                    RolID = table.Column<int>(type: "int", nullable: true),
                    NombrePermisoxRol = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.RolxPermisoID);
                    table.ForeignKey(
                        name: "rolxpermiso_ibfk_1",
                        column: x => x.PermisoID,
                        principalTable: "permiso",
                        principalColumn: "PermisoID");
                    table.ForeignKey(
                        name: "rolxpermiso_ibfk_2",
                        column: x => x.RolID,
                        principalTable: "rol",
                        principalColumn: "RolID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RolID = table.Column<int>(type: "int", nullable: true),
                    Nombre = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Apellido = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Usuario = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Contraseña = table.Column<string>(type: "varchar(150)", maxLength: 150, nullable: true),
                    Telefono = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: true),
                    Correo = table.Column<string>(type: "varchar(75)", maxLength: 75, nullable: true),
                    EstadoUsuario = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.UsuarioID);
                    table.ForeignKey(
                        name: "usuarios_ibfk_1",
                        column: x => x.RolID,
                        principalTable: "rol",
                        principalColumn: "RolID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "detallecompras",
                columns: table => new
                {
                    DetalleCompraID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    CompraID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.DetalleCompraID);
                    table.ForeignKey(
                        name: "detallecompras_ibfk_1",
                        column: x => x.CompraID,
                        principalTable: "compras",
                        principalColumn: "CompraID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "domicilio",
                columns: table => new
                {
                    DomicilioID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    PedidoID = table.Column<int>(type: "int", nullable: true),
                    UsuarioID = table.Column<int>(type: "int", nullable: true),
                    Observacion = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true),
                    FechaEntrega = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "CURRENT_TIMESTAMP"),
                    DireccionDomiciliario = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: true),
                    EstadoDomicilio = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true, defaultValueSql: "'Pendiente'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.DomicilioID);
                    table.ForeignKey(
                        name: "domicilio_ibfk_1",
                        column: x => x.PedidoID,
                        principalTable: "pedido",
                        principalColumn: "PedidoID");
                    table.ForeignKey(
                        name: "domicilio_ibfk_2",
                        column: x => x.UsuarioID,
                        principalTable: "usuarios",
                        principalColumn: "UsuarioID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "lote",
                columns: table => new
                {
                    LoteID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    DetalleCompraID = table.Column<int>(type: "int", nullable: true),
                    ProductoID = table.Column<int>(type: "int", nullable: true),
                    UnidadID = table.Column<int>(type: "int", nullable: true),
                    CantidadCompraPorUnidad = table.Column<int>(type: "int", nullable: true),
                    NumeroLote = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    PrecioCompra = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PrecioPorPresentacionCompra = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PrecioPorUnidadProductoCompra = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PrecioPorUnidadCompra = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CantidadCompra = table.Column<int>(type: "int", nullable: true),
                    CantidadPorUnidadCompra = table.Column<int>(type: "int", nullable: true),
                    PrecioPorUnidad = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PrecioPorPresentacion = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PrecioPorUnidadProducto = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Cantidad = table.Column<int>(type: "int", nullable: true),
                    CantidadPorUnidad = table.Column<int>(type: "int", nullable: true),
                    FechaVencimiento = table.Column<DateTime>(type: "date", nullable: true),
                    EstadoLote = table.Column<ulong>(type: "bit(1)", nullable: true, defaultValueSql: "b'1'")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.LoteID);
                    table.ForeignKey(
                        name: "lote_ibfk_1",
                        column: x => x.ProductoID,
                        principalTable: "productos",
                        principalColumn: "ProductoID");
                    table.ForeignKey(
                        name: "lote_ibfk_2",
                        column: x => x.DetalleCompraID,
                        principalTable: "detallecompras",
                        principalColumn: "DetalleCompraID");
                    table.ForeignKey(
                        name: "lote_ibfk_3",
                        column: x => x.UnidadID,
                        principalTable: "unidad",
                        principalColumn: "UnidadID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "detallepedido",
                columns: table => new
                {
                    DetallePedidoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    PedidoID = table.Column<int>(type: "int", nullable: true),
                    ProductoID = table.Column<int>(type: "int", nullable: true),
                    UnidadID = table.Column<int>(type: "int", nullable: true),
                    LoteID = table.Column<int>(type: "int", nullable: true),
                    Cantidad = table.Column<int>(type: "int", nullable: true),
                    PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SubToTal = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PRIMARY", x => x.DetallePedidoID);
                    table.ForeignKey(
                        name: "detallepedido_ibfk_1",
                        column: x => x.ProductoID,
                        principalTable: "productos",
                        principalColumn: "ProductoID");
                    table.ForeignKey(
                        name: "detallepedido_ibfk_2",
                        column: x => x.PedidoID,
                        principalTable: "pedido",
                        principalColumn: "PedidoID");
                    table.ForeignKey(
                        name: "detallepedido_ibfk_3",
                        column: x => x.UnidadID,
                        principalTable: "unidad",
                        principalColumn: "UnidadID");
                    table.ForeignKey(
                        name: "detallepedido_ibfk_4",
                        column: x => x.LoteID,
                        principalTable: "lote",
                        principalColumn: "LoteID");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "MarcaID",
                table: "categoriaxmarca",
                column: "MarcaID");

            migrationBuilder.CreateIndex(
                name: "PresentacionID",
                table: "categoriaxpresentacion",
                column: "PresentacionID");

            migrationBuilder.CreateIndex(
                name: "UnidadID",
                table: "categoriaxunidad",
                column: "UnidadID");

            migrationBuilder.CreateIndex(
                name: "ProveedorID",
                table: "compras",
                column: "ProveedorID");

            migrationBuilder.CreateIndex(
                name: "CompraID",
                table: "detallecompras",
                column: "CompraID");

            migrationBuilder.CreateIndex(
                name: "LoteID",
                table: "detallepedido",
                column: "LoteID");

            migrationBuilder.CreateIndex(
                name: "PedidoID",
                table: "detallepedido",
                column: "PedidoID");

            migrationBuilder.CreateIndex(
                name: "ProductoID",
                table: "detallepedido",
                column: "ProductoID");

            migrationBuilder.CreateIndex(
                name: "UnidadID1",
                table: "detallepedido",
                column: "UnidadID");

            migrationBuilder.CreateIndex(
                name: "PedidoID1",
                table: "domicilio",
                column: "PedidoID");

            migrationBuilder.CreateIndex(
                name: "UsuarioID",
                table: "domicilio",
                column: "UsuarioID");

            migrationBuilder.CreateIndex(
                name: "DetalleCompraID",
                table: "lote",
                column: "DetalleCompraID");

            migrationBuilder.CreateIndex(
                name: "ProductoID1",
                table: "lote",
                column: "ProductoID");

            migrationBuilder.CreateIndex(
                name: "UnidadID2",
                table: "lote",
                column: "UnidadID");

            migrationBuilder.CreateIndex(
                name: "ClienteID",
                table: "pedido",
                column: "ClienteID");

            migrationBuilder.CreateIndex(
                name: "CategoriaID",
                table: "productos",
                column: "CategoriaID");

            migrationBuilder.CreateIndex(
                name: "MarcaID1",
                table: "productos",
                column: "MarcaID");

            migrationBuilder.CreateIndex(
                name: "PresentacionID1",
                table: "productos",
                column: "PresentacionID");

            migrationBuilder.CreateIndex(
                name: "PermisoID",
                table: "rolxpermiso",
                column: "PermisoID");

            migrationBuilder.CreateIndex(
                name: "RolID",
                table: "rolxpermiso",
                column: "RolID");

            migrationBuilder.CreateIndex(
                name: "ProductoID2",
                table: "unidadxproducto",
                column: "ProductoID");

            migrationBuilder.CreateIndex(
                name: "RolID1",
                table: "usuarios",
                column: "RolID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "categoriaxmarca");

            migrationBuilder.DropTable(
                name: "categoriaxpresentacion");

            migrationBuilder.DropTable(
                name: "categoriaxunidad");

            migrationBuilder.DropTable(
                name: "detallepedido");

            migrationBuilder.DropTable(
                name: "domicilio");

            migrationBuilder.DropTable(
                name: "movimientos");

            migrationBuilder.DropTable(
                name: "rolxpermiso");

            migrationBuilder.DropTable(
                name: "unidadxproducto");

            migrationBuilder.DropTable(
                name: "lote");

            migrationBuilder.DropTable(
                name: "pedido");

            migrationBuilder.DropTable(
                name: "usuarios");

            migrationBuilder.DropTable(
                name: "permiso");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "detallecompras");

            migrationBuilder.DropTable(
                name: "unidad");

            migrationBuilder.DropTable(
                name: "cliente");

            migrationBuilder.DropTable(
                name: "rol");

            migrationBuilder.DropTable(
                name: "presentacion");

            migrationBuilder.DropTable(
                name: "marca");

            migrationBuilder.DropTable(
                name: "categoria");

            migrationBuilder.DropTable(
                name: "compras");

            migrationBuilder.DropTable(
                name: "proveedor");
        }
    }
}
