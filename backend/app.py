from flask import Flask
from extensions import db
from api_routes import api_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Configuración: Usamos SQLite por simplicidad local
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Fin_Report.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)
    # Iniciamos la DB
    db.init_app(app)

    # Registramos las rutas de la API
    app.register_blueprint(api_bp, url_prefix='/api')

    # Creamos las tablas si no existen (útil para apps locales)
    with app.app_context():
        from models import Orden, Producto, Cuenta, MovimientoCuenta, Produccion, Inventario, ClasificacionCuenta, Registro, TipoRegistro
        # 1. Crear las tablas si no existen
        db.create_all()
        
        # 2. Inicializar Clasificaciones primero (Requisito para las llaves foráneas)
        # Definimos las categorías únicas necesarias
        categorias_necesarias = ['Activo', 'Pasivo', 'Capital']
        
        # Diccionario para guardar los IDs en memoria temporalmente: {'Activo': 1, 'Pasivo': 2...}
        mapa_clasificaciones = {} 

        for nombre_cat in categorias_necesarias:
            # Buscamos si ya existe para no duplicar
            clasificacion = ClasificacionCuenta.query.filter_by(nombre=nombre_cat).first()
            
            if not clasificacion:
                clasificacion = ClasificacionCuenta(nombre=nombre_cat)
                db.session.add(clasificacion)
                db.session.commit() # Hacemos commit para generar el ID
            
            # Guardamos el ID en nuestro mapa para usarlo abajo
            mapa_clasificaciones[nombre_cat] = clasificacion.id

        # 3. Inicializar Cuentas (Usando los IDs de las clasificaciones)
        if Cuenta.query.count() == 0:
            cuentas_iniciales = [
                {'cuenta': 'Caja', 'clasificacion': 'Activo'},
                {'cuenta': 'Bancos', 'clasificacion': 'Activo'},
                {'cuenta': 'Clientes', 'clasificacion': 'Activo'},
                {'cuenta': 'Inventarios', 'clasificacion': 'Activo'},
                {'cuenta': 'Equipo de Transporte', 'clasificacion': 'Activo'},
                {'cuenta': 'Mobiliario y Equipo', 'clasificacion': 'Activo'},
                {'cuenta': 'Edificio', 'clasificacion': 'Activo'},
                {'cuenta': 'Terrenos', 'clasificacion': 'Activo'},
                {'cuenta': 'Proveedores', 'clasificacion': 'Pasivo'},
                {'cuenta': 'Documentos por Pagar', 'clasificacion': 'Pasivo'},
                {'cuenta': 'Acreedores Diversos', 'clasificacion': 'Pasivo'},
                {'cuenta': 'Hipotecas por Pagar', 'clasificacion': 'Pasivo'},
                {'cuenta': 'Capital Social', 'clasificacion': 'Capital'},
                {'cuenta': 'Utilidad del Ejercicio', 'clasificacion': 'Capital'},
                {'cuenta': 'Reserva Legal', 'clasificacion': 'Capital'}
            ]
            
            print("Inicializando cuentas base...")
            
            for cuenta_data in cuentas_iniciales:
                # Buscamos el ID numérico usando el nombre de la clasificación
                id_clasif_correspondiente = mapa_clasificaciones[cuenta_data['clasificacion']]
                
                nueva_cuenta = Cuenta(
                    nombre=cuenta_data['cuenta'],
                    id_clasificacion=id_clasif_correspondiente
                    # Nota: Eliminé 'descripcion' porque en el modelo actual 'Cuenta' no tiene ese campo.
                    # Si quieres guardarlo, avísame para agregarlo al modelo.
                )
                db.session.add(nueva_cuenta)
            
            db.session.commit()
            print("✓ Base de datos inicializada con Clasificaciones y Cuentas.")
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001, use_reloader=False)