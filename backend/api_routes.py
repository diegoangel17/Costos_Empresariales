from flask import Blueprint, jsonify, request # type: ignore
from extensions import db
from models import Orden, Producto, Cuenta, MovimientoCuenta, Produccion, Inventario, ClasificacionCuenta, Registro, TipoRegistro


# Creamos un Blueprint general para la API
api_bp = Blueprint('api', __name__)


@api_bp.route('/clasificaciones', methods=['GET'])
def obtener_clasificaciones():
    clasificaciones = ClasificacionCuenta.query.all()
    # Usamos el método to_json() que ya definimos en el modelo
    return jsonify([c.to_json() for c in clasificaciones]), 200

@api_bp.route('/clasificaciones', methods=['POST'])
def crear_clasificacion():
    data = request.json
    if not data.get('nombre'):
        return jsonify({'error': 'Faltan datos obligatorios(SV)'}), 400
    nueva_clasificacion = ClasificacionCuenta(nombre=data['nombre'])
    try:
        db.session.add(nueva_clasificacion)
        db.session.commit()
        return jsonify(nueva_clasificacion.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@api_bp.route('/clasificaciones/<int:id>', methods=['PUT'])
def actualizar_clasificacion(id):
    clasificacion = ClasificacionCuenta.query.get_or_404(id) # Busca o da error 404
    data = request.json
    # Actualizamos solo si envían el dato
    if 'nombre' in data:
        clasificacion.nombre = data['nombre']
    db.session.commit()
    return jsonify(clasificacion.to_json()), 200


@api_bp.route('/cuentas', methods=['GET'])
def obtener_cuentas():
    cuentas = Cuenta.query.all()
    # Usamos el método to_json() que ya definimos en el modelo
    return jsonify([c.to_json() for c in cuentas]), 200

@api_bp.route('/cuentas/<int:id>', methods=['PUT'])
def actualizar_cuenta(id):
    cuenta = Cuenta.query.get_or_404(id) # Busca o da error 404
    data = request.json

    # Actualizamos solo si envían el dato
    if 'nombre' in data:
        cuenta.nombre = data['nombre']
    if 'id_clasificacion' in data:
        cuenta.id_clasificacion = data['id_clasificacion']

    db.session.commit()
    return jsonify(cuenta.to_json()), 200

@api_bp.route('/cuentas/<int:id>', methods=['DELETE'])
def eliminar_cuenta(id):
    cuenta = Cuenta.query.get_or_404(id)
    
    # 1. VALIDACIÓN DE SEGURIDAD (Integridad Referencial)
    # Buscamos si existen movimientos vinculados a esta cuenta
    movimientos_existentes = MovimientoCuenta.query.filter_by(id_cuenta=id).count()
    
    if movimientos_existentes > 0:
        return jsonify({
            'error': 'No se puede eliminar: Esta cuenta tiene movimientos contables registrados.'
        }), 409 # 409 Conflict
        
    # 2. Si está limpia, procedemos a borrar
    db.session.delete(cuenta)
    db.session.commit()
    
    return jsonify({'mensaje': 'Cuenta eliminada correctamente'}), 200

@api_bp.route('/cuentas', methods=['POST'])
def crear_cuenta():
    data = request.json
    
    # 1. Validación básica
    if not data.get('nombre') or not data.get('id_clasificacion'):
        return jsonify({'error': 'Faltan datos obligatorios (Sv)'}), 400

    # 2. Crear el objeto
    nueva_cuenta = Cuenta(
        nombre=data['nombre'],
        id_clasificacion=data['id_clasificacion']
    )
    
    # 3. Guardar en BD
    try:
        db.session.add(nueva_cuenta)
        db.session.commit()
        # Devolvemos la cuenta creada (importante para que el frontend la muestre sin recargar)
        return jsonify(nueva_cuenta.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500