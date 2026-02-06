// Location search data for MexicoHomeFinder
// Includes states and popular municipalities for cascading dropdowns

export type LocationItem = {
  name: string;
  type: 'state' | 'municipality' | 'neighborhood';
  state?: string;
  municipality?: string;
  slug: string;
};

// Popular locations to show first (before typing)
export const popularLocations: LocationItem[] = [
  { name: 'San Miguel de Allende', type: 'municipality', state: 'Guanajuato', slug: 'san-miguel-de-allende' },
  { name: 'Puerto Vallarta', type: 'municipality', state: 'Jalisco', slug: 'puerto-vallarta' },
  { name: 'Playa del Carmen', type: 'municipality', state: 'Quintana Roo', slug: 'playa-del-carmen' },
  { name: 'Tulum', type: 'municipality', state: 'Quintana Roo', slug: 'tulum' },
  { name: 'Los Cabos', type: 'municipality', state: 'Baja California Sur', slug: 'los-cabos' },
  { name: 'Mérida', type: 'municipality', state: 'Yucatán', slug: 'merida' },
  { name: 'Cancún', type: 'municipality', state: 'Quintana Roo', slug: 'cancun' },
  { name: 'Oaxaca', type: 'state', slug: 'oaxaca' },
  { name: 'Lake Chapala', type: 'municipality', state: 'Jalisco', slug: 'lake-chapala' },
  { name: 'Guanajuato', type: 'state', slug: 'guanajuato' },
];

// Full Mexico locations data (states and municipalities)
export const mexicoLocations: LocationItem[] = [
  // ===== STATES =====
  { name: 'Aguascalientes', type: 'state', slug: 'aguascalientes' },
  { name: 'Baja California', type: 'state', slug: 'baja-california' },
  { name: 'Baja California Sur', type: 'state', slug: 'baja-california-sur' },
  { name: 'Campeche', type: 'state', slug: 'campeche' },
  { name: 'Chiapas', type: 'state', slug: 'chiapas' },
  { name: 'Chihuahua', type: 'state', slug: 'chihuahua' },
  { name: 'Ciudad de México', type: 'state', slug: 'ciudad-de-mexico' },
  { name: 'Coahuila', type: 'state', slug: 'coahuila' },
  { name: 'Colima', type: 'state', slug: 'colima' },
  { name: 'Durango', type: 'state', slug: 'durango' },
  { name: 'Guanajuato', type: 'state', slug: 'guanajuato' },
  { name: 'Guerrero', type: 'state', slug: 'guerrero' },
  { name: 'Hidalgo', type: 'state', slug: 'hidalgo' },
  { name: 'Jalisco', type: 'state', slug: 'jalisco' },
  { name: 'México', type: 'state', slug: 'mexico' },
  { name: 'Michoacán', type: 'state', slug: 'michoacan' },
  { name: 'Morelos', type: 'state', slug: 'morelos' },
  { name: 'Nayarit', type: 'state', slug: 'nayarit' },
  { name: 'Nuevo León', type: 'state', slug: 'nuevo-leon' },
  { name: 'Oaxaca', type: 'state', slug: 'oaxaca' },
  { name: 'Puebla', type: 'state', slug: 'puebla' },
  { name: 'Querétaro', type: 'state', slug: 'queretaro' },
  { name: 'Quintana Roo', type: 'state', slug: 'quintana-roo' },
  { name: 'San Luis Potosí', type: 'state', slug: 'san-luis-potosi' },
  { name: 'Sinaloa', type: 'state', slug: 'sinaloa' },
  { name: 'Sonora', type: 'state', slug: 'sonora' },
  { name: 'Tabasco', type: 'state', slug: 'tabasco' },
  { name: 'Tamaulipas', type: 'state', slug: 'tamaulipas' },
  { name: 'Tlaxcala', type: 'state', slug: 'tlaxcala' },
  { name: 'Veracruz', type: 'state', slug: 'veracruz' },
  { name: 'Yucatán', type: 'state', slug: 'yucatan' },
  { name: 'Zacatecas', type: 'state', slug: 'zacatecas' },

  // ===== MUNICIPALITIES BY STATE =====

  // Aguascalientes
  { name: 'Aguascalientes', type: 'municipality', state: 'Aguascalientes', slug: 'aguascalientes-city' },
  { name: 'Jesús María', type: 'municipality', state: 'Aguascalientes', slug: 'jesus-maria' },
  { name: 'Calvillo', type: 'municipality', state: 'Aguascalientes', slug: 'calvillo' },

  // Baja California
  { name: 'Tijuana', type: 'municipality', state: 'Baja California', slug: 'tijuana' },
  { name: 'Ensenada', type: 'municipality', state: 'Baja California', slug: 'ensenada' },
  { name: 'Mexicali', type: 'municipality', state: 'Baja California', slug: 'mexicali' },
  { name: 'Rosarito', type: 'municipality', state: 'Baja California', slug: 'rosarito' },
  { name: 'Tecate', type: 'municipality', state: 'Baja California', slug: 'tecate' },
  { name: 'San Felipe', type: 'municipality', state: 'Baja California', slug: 'san-felipe' },
  { name: 'Valle de Guadalupe', type: 'municipality', state: 'Baja California', slug: 'valle-de-guadalupe' },

  // Baja California Sur
  { name: 'Los Cabos', type: 'municipality', state: 'Baja California Sur', slug: 'los-cabos' },
  { name: 'Cabo San Lucas', type: 'municipality', state: 'Baja California Sur', slug: 'cabo-san-lucas' },
  { name: 'San José del Cabo', type: 'municipality', state: 'Baja California Sur', slug: 'san-jose-del-cabo' },
  { name: 'La Paz', type: 'municipality', state: 'Baja California Sur', slug: 'la-paz' },
  { name: 'Loreto', type: 'municipality', state: 'Baja California Sur', slug: 'loreto' },
  { name: 'Todos Santos', type: 'municipality', state: 'Baja California Sur', slug: 'todos-santos' },
  { name: 'Mulegé', type: 'municipality', state: 'Baja California Sur', slug: 'mulege' },
  { name: 'East Cape', type: 'municipality', state: 'Baja California Sur', slug: 'east-cape' },

  // Campeche
  { name: 'Campeche', type: 'municipality', state: 'Campeche', slug: 'campeche-city' },
  { name: 'Ciudad del Carmen', type: 'municipality', state: 'Campeche', slug: 'ciudad-del-carmen' },

  // Chiapas
  { name: 'San Cristóbal de las Casas', type: 'municipality', state: 'Chiapas', slug: 'san-cristobal-de-las-casas' },
  { name: 'Tuxtla Gutiérrez', type: 'municipality', state: 'Chiapas', slug: 'tuxtla-gutierrez' },
  { name: 'Palenque', type: 'municipality', state: 'Chiapas', slug: 'palenque' },
  { name: 'Comitán', type: 'municipality', state: 'Chiapas', slug: 'comitan' },
  { name: 'Chiapa de Corzo', type: 'municipality', state: 'Chiapas', slug: 'chiapa-de-corzo' },

  // Chihuahua
  { name: 'Chihuahua', type: 'municipality', state: 'Chihuahua', slug: 'chihuahua-city' },
  { name: 'Ciudad Juárez', type: 'municipality', state: 'Chihuahua', slug: 'ciudad-juarez' },
  { name: 'Creel', type: 'municipality', state: 'Chihuahua', slug: 'creel' },
  { name: 'Delicias', type: 'municipality', state: 'Chihuahua', slug: 'delicias' },

  // Ciudad de México (Alcaldías)
  { name: 'Álvaro Obregón', type: 'municipality', state: 'Ciudad de México', slug: 'alvaro-obregon' },
  { name: 'Azcapotzalco', type: 'municipality', state: 'Ciudad de México', slug: 'azcapotzalco' },
  { name: 'Benito Juárez', type: 'municipality', state: 'Ciudad de México', slug: 'benito-juarez' },
  { name: 'Coyoacán', type: 'municipality', state: 'Ciudad de México', slug: 'coyoacan' },
  { name: 'Cuajimalpa', type: 'municipality', state: 'Ciudad de México', slug: 'cuajimalpa' },
  { name: 'Cuauhtémoc', type: 'municipality', state: 'Ciudad de México', slug: 'cuauhtemoc' },
  { name: 'Gustavo A. Madero', type: 'municipality', state: 'Ciudad de México', slug: 'gustavo-a-madero' },
  { name: 'Iztacalco', type: 'municipality', state: 'Ciudad de México', slug: 'iztacalco' },
  { name: 'Iztapalapa', type: 'municipality', state: 'Ciudad de México', slug: 'iztapalapa' },
  { name: 'La Magdalena Contreras', type: 'municipality', state: 'Ciudad de México', slug: 'magdalena-contreras' },
  { name: 'Miguel Hidalgo', type: 'municipality', state: 'Ciudad de México', slug: 'miguel-hidalgo' },
  { name: 'Milpa Alta', type: 'municipality', state: 'Ciudad de México', slug: 'milpa-alta' },
  { name: 'Tláhuac', type: 'municipality', state: 'Ciudad de México', slug: 'tlahuac' },
  { name: 'Tlalpan', type: 'municipality', state: 'Ciudad de México', slug: 'tlalpan' },
  { name: 'Venustiano Carranza', type: 'municipality', state: 'Ciudad de México', slug: 'venustiano-carranza' },
  { name: 'Xochimilco', type: 'municipality', state: 'Ciudad de México', slug: 'xochimilco' },

  // Coahuila
  { name: 'Saltillo', type: 'municipality', state: 'Coahuila', slug: 'saltillo' },
  { name: 'Torreón', type: 'municipality', state: 'Coahuila', slug: 'torreon' },
  { name: 'Monclova', type: 'municipality', state: 'Coahuila', slug: 'monclova' },
  { name: 'Piedras Negras', type: 'municipality', state: 'Coahuila', slug: 'piedras-negras' },

  // Colima
  { name: 'Colima', type: 'municipality', state: 'Colima', slug: 'colima-city' },
  { name: 'Manzanillo', type: 'municipality', state: 'Colima', slug: 'manzanillo' },
  { name: 'Tecomán', type: 'municipality', state: 'Colima', slug: 'tecoman' },

  // Durango
  { name: 'Durango', type: 'municipality', state: 'Durango', slug: 'durango-city' },
  { name: 'Gómez Palacio', type: 'municipality', state: 'Durango', slug: 'gomez-palacio' },
  { name: 'Lerdo', type: 'municipality', state: 'Durango', slug: 'lerdo' },

  // Guanajuato
  { name: 'San Miguel de Allende', type: 'municipality', state: 'Guanajuato', slug: 'san-miguel-de-allende' },
  { name: 'Guanajuato', type: 'municipality', state: 'Guanajuato', slug: 'guanajuato-city' },
  { name: 'León', type: 'municipality', state: 'Guanajuato', slug: 'leon' },
  { name: 'Irapuato', type: 'municipality', state: 'Guanajuato', slug: 'irapuato' },
  { name: 'Celaya', type: 'municipality', state: 'Guanajuato', slug: 'celaya' },
  { name: 'Salamanca', type: 'municipality', state: 'Guanajuato', slug: 'salamanca' },
  { name: 'Dolores Hidalgo', type: 'municipality', state: 'Guanajuato', slug: 'dolores-hidalgo' },
  { name: 'Silao', type: 'municipality', state: 'Guanajuato', slug: 'silao' },
  { name: 'San José Iturbide', type: 'municipality', state: 'Guanajuato', slug: 'san-jose-iturbide' },
  { name: 'Atotonilco', type: 'municipality', state: 'Guanajuato', slug: 'atotonilco' },

  // Guerrero
  { name: 'Acapulco', type: 'municipality', state: 'Guerrero', slug: 'acapulco' },
  { name: 'Ixtapa', type: 'municipality', state: 'Guerrero', slug: 'ixtapa' },
  { name: 'Zihuatanejo', type: 'municipality', state: 'Guerrero', slug: 'zihuatanejo' },
  { name: 'Taxco', type: 'municipality', state: 'Guerrero', slug: 'taxco' },
  { name: 'Chilpancingo', type: 'municipality', state: 'Guerrero', slug: 'chilpancingo' },

  // Hidalgo
  { name: 'Pachuca', type: 'municipality', state: 'Hidalgo', slug: 'pachuca' },
  { name: 'Tula', type: 'municipality', state: 'Hidalgo', slug: 'tula' },
  { name: 'Tulancingo', type: 'municipality', state: 'Hidalgo', slug: 'tulancingo' },

  // Jalisco
  { name: 'Puerto Vallarta', type: 'municipality', state: 'Jalisco', slug: 'puerto-vallarta' },
  { name: 'Guadalajara', type: 'municipality', state: 'Jalisco', slug: 'guadalajara' },
  { name: 'Ajijic', type: 'municipality', state: 'Jalisco', slug: 'ajijic' },
  { name: 'Chapala', type: 'municipality', state: 'Jalisco', slug: 'chapala' },
  { name: 'Lake Chapala', type: 'municipality', state: 'Jalisco', slug: 'lake-chapala' },
  { name: 'Zapopan', type: 'municipality', state: 'Jalisco', slug: 'zapopan' },
  { name: 'Tlaquepaque', type: 'municipality', state: 'Jalisco', slug: 'tlaquepaque' },
  { name: 'Tonalá', type: 'municipality', state: 'Jalisco', slug: 'tonala' },
  { name: 'Tlajomulco', type: 'municipality', state: 'Jalisco', slug: 'tlajomulco' },
  { name: 'Tequila', type: 'municipality', state: 'Jalisco', slug: 'tequila' },
  { name: 'Tapalpa', type: 'municipality', state: 'Jalisco', slug: 'tapalpa' },
  { name: 'Jocotepec', type: 'municipality', state: 'Jalisco', slug: 'jocotepec' },
  { name: 'San Juan Cosalá', type: 'municipality', state: 'Jalisco', slug: 'san-juan-cosala' },

  // México (State of Mexico)
  { name: 'Toluca', type: 'municipality', state: 'México', slug: 'toluca' },
  { name: 'Metepec', type: 'municipality', state: 'México', slug: 'metepec' },
  { name: 'Naucalpan', type: 'municipality', state: 'México', slug: 'naucalpan' },
  { name: 'Tlalnepantla', type: 'municipality', state: 'México', slug: 'tlalnepantla' },
  { name: 'Ecatepec', type: 'municipality', state: 'México', slug: 'ecatepec' },
  { name: 'Huixquilucan', type: 'municipality', state: 'México', slug: 'huixquilucan' },
  { name: 'Atizapán', type: 'municipality', state: 'México', slug: 'atizapan' },
  { name: 'Coacalco', type: 'municipality', state: 'México', slug: 'coacalco' },
  { name: 'Valle de Bravo', type: 'municipality', state: 'México', slug: 'valle-de-bravo' },
  { name: 'Tepotzotlán', type: 'municipality', state: 'México', slug: 'tepotzotlan' },

  // Michoacán
  { name: 'Morelia', type: 'municipality', state: 'Michoacán', slug: 'morelia' },
  { name: 'Pátzcuaro', type: 'municipality', state: 'Michoacán', slug: 'patzcuaro' },
  { name: 'Uruapan', type: 'municipality', state: 'Michoacán', slug: 'uruapan' },
  { name: 'Lázaro Cárdenas', type: 'municipality', state: 'Michoacán', slug: 'lazaro-cardenas' },
  { name: 'Zamora', type: 'municipality', state: 'Michoacán', slug: 'zamora' },

  // Morelos
  { name: 'Cuernavaca', type: 'municipality', state: 'Morelos', slug: 'cuernavaca' },
  { name: 'Tepoztlán', type: 'municipality', state: 'Morelos', slug: 'tepoztlan' },
  { name: 'Jiutepec', type: 'municipality', state: 'Morelos', slug: 'jiutepec' },
  { name: 'Cuautla', type: 'municipality', state: 'Morelos', slug: 'cuautla' },
  { name: 'Temixco', type: 'municipality', state: 'Morelos', slug: 'temixco' },

  // Nayarit
  { name: 'Sayulita', type: 'municipality', state: 'Nayarit', slug: 'sayulita' },
  { name: 'Punta de Mita', type: 'municipality', state: 'Nayarit', slug: 'punta-de-mita' },
  { name: 'Tepic', type: 'municipality', state: 'Nayarit', slug: 'tepic' },
  { name: 'San Pancho', type: 'municipality', state: 'Nayarit', slug: 'san-pancho' },
  { name: 'Bucerías', type: 'municipality', state: 'Nayarit', slug: 'bucerias' },
  { name: 'Nuevo Vallarta', type: 'municipality', state: 'Nayarit', slug: 'nuevo-vallarta' },
  { name: 'Lo de Marcos', type: 'municipality', state: 'Nayarit', slug: 'lo-de-marcos' },
  { name: 'Rincón de Guayabitos', type: 'municipality', state: 'Nayarit', slug: 'rincon-de-guayabitos' },

  // Nuevo León
  { name: 'Monterrey', type: 'municipality', state: 'Nuevo León', slug: 'monterrey' },
  { name: 'San Pedro Garza García', type: 'municipality', state: 'Nuevo León', slug: 'san-pedro-garza-garcia' },
  { name: 'San Nicolás', type: 'municipality', state: 'Nuevo León', slug: 'san-nicolas' },
  { name: 'Guadalupe', type: 'municipality', state: 'Nuevo León', slug: 'guadalupe-nl' },
  { name: 'Santa Catarina', type: 'municipality', state: 'Nuevo León', slug: 'santa-catarina' },
  { name: 'Apodaca', type: 'municipality', state: 'Nuevo León', slug: 'apodaca' },

  // Oaxaca
  { name: 'Oaxaca de Juárez', type: 'municipality', state: 'Oaxaca', slug: 'oaxaca-de-juarez' },
  { name: 'Huatulco', type: 'municipality', state: 'Oaxaca', slug: 'huatulco' },
  { name: 'Puerto Escondido', type: 'municipality', state: 'Oaxaca', slug: 'puerto-escondido' },
  { name: 'Mazunte', type: 'municipality', state: 'Oaxaca', slug: 'mazunte' },
  { name: 'Zipolite', type: 'municipality', state: 'Oaxaca', slug: 'zipolite' },
  { name: 'Puerto Ángel', type: 'municipality', state: 'Oaxaca', slug: 'puerto-angel' },
  { name: 'Mitla', type: 'municipality', state: 'Oaxaca', slug: 'mitla' },
  { name: 'Monte Albán', type: 'municipality', state: 'Oaxaca', slug: 'monte-alban' },

  // Puebla
  { name: 'Puebla', type: 'municipality', state: 'Puebla', slug: 'puebla-city' },
  { name: 'Cholula', type: 'municipality', state: 'Puebla', slug: 'cholula' },
  { name: 'Atlixco', type: 'municipality', state: 'Puebla', slug: 'atlixco' },
  { name: 'Tehuacán', type: 'municipality', state: 'Puebla', slug: 'tehuacan' },
  { name: 'Cuetzalan', type: 'municipality', state: 'Puebla', slug: 'cuetzalan' },

  // Querétaro
  { name: 'Querétaro', type: 'municipality', state: 'Querétaro', slug: 'queretaro-city' },
  { name: 'San Juan del Río', type: 'municipality', state: 'Querétaro', slug: 'san-juan-del-rio' },
  { name: 'Tequisquiapan', type: 'municipality', state: 'Querétaro', slug: 'tequisquiapan' },
  { name: 'El Marqués', type: 'municipality', state: 'Querétaro', slug: 'el-marques' },
  { name: 'Corregidora', type: 'municipality', state: 'Querétaro', slug: 'corregidora' },
  { name: 'Bernal', type: 'municipality', state: 'Querétaro', slug: 'bernal' },

  // Quintana Roo
  { name: 'Cancún', type: 'municipality', state: 'Quintana Roo', slug: 'cancun' },
  { name: 'Playa del Carmen', type: 'municipality', state: 'Quintana Roo', slug: 'playa-del-carmen' },
  { name: 'Tulum', type: 'municipality', state: 'Quintana Roo', slug: 'tulum' },
  { name: 'Cozumel', type: 'municipality', state: 'Quintana Roo', slug: 'cozumel' },
  { name: 'Bacalar', type: 'municipality', state: 'Quintana Roo', slug: 'bacalar' },
  { name: 'Holbox', type: 'municipality', state: 'Quintana Roo', slug: 'holbox' },
  { name: 'Isla Mujeres', type: 'municipality', state: 'Quintana Roo', slug: 'isla-mujeres' },
  { name: 'Puerto Morelos', type: 'municipality', state: 'Quintana Roo', slug: 'puerto-morelos' },
  { name: 'Akumal', type: 'municipality', state: 'Quintana Roo', slug: 'akumal' },
  { name: 'Chetumal', type: 'municipality', state: 'Quintana Roo', slug: 'chetumal' },
  { name: 'Riviera Maya', type: 'municipality', state: 'Quintana Roo', slug: 'riviera-maya' },
  { name: 'Puerto Aventuras', type: 'municipality', state: 'Quintana Roo', slug: 'puerto-aventuras' },

  // San Luis Potosí
  { name: 'San Luis Potosí', type: 'municipality', state: 'San Luis Potosí', slug: 'san-luis-potosi-city' },
  { name: 'Real de Catorce', type: 'municipality', state: 'San Luis Potosí', slug: 'real-de-catorce' },
  { name: 'Xilitla', type: 'municipality', state: 'San Luis Potosí', slug: 'xilitla' },

  // Sinaloa
  { name: 'Mazatlán', type: 'municipality', state: 'Sinaloa', slug: 'mazatlan' },
  { name: 'Culiacán', type: 'municipality', state: 'Sinaloa', slug: 'culiacan' },
  { name: 'Los Mochis', type: 'municipality', state: 'Sinaloa', slug: 'los-mochis' },

  // Sonora
  { name: 'Hermosillo', type: 'municipality', state: 'Sonora', slug: 'hermosillo' },
  { name: 'Puerto Peñasco', type: 'municipality', state: 'Sonora', slug: 'puerto-penasco' },
  { name: 'San Carlos', type: 'municipality', state: 'Sonora', slug: 'san-carlos' },
  { name: 'Guaymas', type: 'municipality', state: 'Sonora', slug: 'guaymas' },
  { name: 'Nogales', type: 'municipality', state: 'Sonora', slug: 'nogales' },

  // Tabasco
  { name: 'Villahermosa', type: 'municipality', state: 'Tabasco', slug: 'villahermosa' },

  // Tamaulipas
  { name: 'Tampico', type: 'municipality', state: 'Tamaulipas', slug: 'tampico' },
  { name: 'Reynosa', type: 'municipality', state: 'Tamaulipas', slug: 'reynosa' },
  { name: 'Matamoros', type: 'municipality', state: 'Tamaulipas', slug: 'matamoros' },
  { name: 'Ciudad Victoria', type: 'municipality', state: 'Tamaulipas', slug: 'ciudad-victoria' },

  // Tlaxcala
  { name: 'Tlaxcala', type: 'municipality', state: 'Tlaxcala', slug: 'tlaxcala-city' },
  { name: 'Huamantla', type: 'municipality', state: 'Tlaxcala', slug: 'huamantla' },

  // Veracruz
  { name: 'Veracruz', type: 'municipality', state: 'Veracruz', slug: 'veracruz-city' },
  { name: 'Xalapa', type: 'municipality', state: 'Veracruz', slug: 'xalapa' },
  { name: 'Coatepec', type: 'municipality', state: 'Veracruz', slug: 'coatepec' },
  { name: 'Boca del Río', type: 'municipality', state: 'Veracruz', slug: 'boca-del-rio' },
  { name: 'Tlacotalpan', type: 'municipality', state: 'Veracruz', slug: 'tlacotalpan' },
  { name: 'Xico', type: 'municipality', state: 'Veracruz', slug: 'xico' },
  { name: 'Córdoba', type: 'municipality', state: 'Veracruz', slug: 'cordoba' },
  { name: 'Orizaba', type: 'municipality', state: 'Veracruz', slug: 'orizaba' },

  // Yucatán
  { name: 'Mérida', type: 'municipality', state: 'Yucatán', slug: 'merida' },
  { name: 'Progreso', type: 'municipality', state: 'Yucatán', slug: 'progreso' },
  { name: 'Valladolid', type: 'municipality', state: 'Yucatán', slug: 'valladolid' },
  { name: 'Izamal', type: 'municipality', state: 'Yucatán', slug: 'izamal' },
  { name: 'Celestún', type: 'municipality', state: 'Yucatán', slug: 'celestun' },
  { name: 'Chichén Itzá', type: 'municipality', state: 'Yucatán', slug: 'chichen-itza' },
  { name: 'Sisal', type: 'municipality', state: 'Yucatán', slug: 'sisal' },
  { name: 'Telchac Puerto', type: 'municipality', state: 'Yucatán', slug: 'telchac-puerto' },

  // Zacatecas
  { name: 'Zacatecas', type: 'municipality', state: 'Zacatecas', slug: 'zacatecas-city' },
  { name: 'Fresnillo', type: 'municipality', state: 'Zacatecas', slug: 'fresnillo' },
  { name: 'Jerez', type: 'municipality', state: 'Zacatecas', slug: 'jerez' },
];

// Helper to create slug from name
export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Search function
export const searchLocations = (query: string): LocationItem[] => {
  if (!query || query.length < 2) {
    return popularLocations;
  }

  const normalizedQuery = query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return mexicoLocations
    .filter((location) => {
      const normalizedName = location.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      
      const normalizedState = (location.state || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedState.includes(normalizedQuery)
      );
    })
    .slice(0, 10); // Limit results
};

// Get all state names
export const getStateNames = (): string[] => {
  return mexicoLocations
    .filter(loc => loc.type === 'state')
    .map(loc => loc.name)
    .sort();
};

// Get municipalities for a given state
export const getMunicipalitiesByState = (stateName: string): { name: string }[] => {
  return mexicoLocations
    .filter(loc => loc.type === 'municipality' && loc.state === stateName)
    .map(loc => ({ name: loc.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
};
