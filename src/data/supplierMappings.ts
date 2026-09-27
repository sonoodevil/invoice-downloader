export interface SupplierMapping {
  id: string;
  sheetSupplier: string;
  category: 'Purchases' | 'Overhead/Service' | string;
  driveFolderMatches: string;
  canonicalName: string;
}

export const MASTER_SUPPLIER_MAPPINGS: SupplierMapping[] = [
  { id: 'sup-1', sheetSupplier: '1&1 Ionos', category: 'Overhead/Service', driveFolderMatches: '1&1 Ionos', canonicalName: '1&1 Ionos' },
  { id: 'sup-2', sheetSupplier: 'A&M Building Renovation LTD', category: 'Overhead/Service', driveFolderMatches: 'A&M Building Renovation Ltd', canonicalName: 'A&M Building Renovation LTD' },
  { id: 'sup-3', sheetSupplier: 'AMP Electrical Supplies Ltd', category: 'Purchases', driveFolderMatches: 'AMP Electrical Suppliers Ltd / click4electrics', canonicalName: 'AMP Electrical Supplies Ltd | AMP Electrical Supplies Ltd || Click4Electrics' },
  { id: 'sup-4', sheetSupplier: 'Ace Fire Midlands Ltd', category: 'Purchases', driveFolderMatches: 'Ace Fire Midlands Ltd', canonicalName: 'Ace Fire Midlands Ltd' },
  { id: 'sup-5', sheetSupplier: 'Alert Electrical Wholesalers Ltd', category: 'Purchases', driveFolderMatches: 'Alert Electrical Wholesalers Ltd', canonicalName: 'Alert Electrical Wholesalers Ltd' },
  { id: 'sup-6', sheetSupplier: 'Alfred Victoria Ltd', category: 'Purchases', driveFolderMatches: 'Alfred Victoria Ltd', canonicalName: 'Alfred Victoria Ltd' },
  { id: 'sup-7', sheetSupplier: 'Alliance Sanitary Products Ltd', category: 'Purchases', driveFolderMatches: 'Alliance Sanitary Products Ltd', canonicalName: 'Alliance Sanitary Products Ltd' },
  { id: 'sup-8', sheetSupplier: 'Amazon UK', category: 'Overhead/Service', driveFolderMatches: 'Amazon UK', canonicalName: 'AMAZON | Amazon UK' },
  { id: 'sup-9', sheetSupplier: 'Ambiance Bain', category: 'Purchases', driveFolderMatches: 'Ambiance Bain', canonicalName: 'Ambiance Bain' },
  { id: 'sup-10', sheetSupplier: 'Anchor Pumps', category: 'Purchases', driveFolderMatches: 'Anchor Pumps', canonicalName: 'Anchor Pumps' },
  { id: 'sup-11', sheetSupplier: 'Anglian Pumping Services', category: 'Purchases', driveFolderMatches: 'Anglian Pumping Services', canonicalName: 'Anglian Pumping Services' },
  { id: 'sup-12', sheetSupplier: 'Anns Trading', category: 'Purchases', driveFolderMatches: 'Anns Trading Ltd', canonicalName: 'Anns Trading' },
  { id: 'sup-13', sheetSupplier: 'Approved Services', category: 'Purchases', driveFolderMatches: 'Approved Services', canonicalName: 'Approved Services' },
  { id: 'sup-14', sheetSupplier: 'Ariston U.K. Ltd', category: 'Purchases', driveFolderMatches: 'Ariston UK Ltd', canonicalName: 'Ariston U.K. Ltd' },
  { id: 'sup-15', sheetSupplier: 'Austen Group Ltd', category: 'Purchases', driveFolderMatches: 'Austen Group Ltd', canonicalName: 'Austen Group Ltd' },
  { id: 'sup-16', sheetSupplier: 'B&Q', category: 'Overhead/Service', driveFolderMatches: 'B&Q Limited', canonicalName: 'B and Q DIY UK Seller | B&Q' },
  { id: 'sup-17', sheetSupplier: 'BES', category: 'Purchases', driveFolderMatches: 'BES', canonicalName: 'BES' },
  { id: 'sup-18', sheetSupplier: 'BP Fuel', category: 'Overhead/Service', driveFolderMatches: 'BP Fuel', canonicalName: 'BP Fuel' },
  { id: 'sup-19', sheetSupplier: 'BSH Home Appliances Ltd', category: 'Purchases', driveFolderMatches: 'BSH Home Appliances Ltd', canonicalName: 'BSH Home Appliances Ltd' },
  { id: 'sup-20', sheetSupplier: 'BT Group', category: 'Overhead/Service', driveFolderMatches: 'BT Group', canonicalName: 'BT Group' },
  { id: 'sup-21', sheetSupplier: 'Banks & Lloyd (Shipping) Limited', category: 'Overhead/Service', driveFolderMatches: 'Banks & Lloyd', canonicalName: 'Banks & Lloyd (Shipping) Limited' },
  { id: 'sup-22', sheetSupplier: 'Barco', category: 'Purchases', driveFolderMatches: 'Barco', canonicalName: 'Barco' },
  { id: 'sup-23', sheetSupplier: 'Bargain Care', category: 'Purchases', driveFolderMatches: 'Bargain Care', canonicalName: 'Bargain Care' },
  { id: 'sup-24', sheetSupplier: 'Barwick', category: 'Purchases', driveFolderMatches: 'Barwick', canonicalName: 'Barwick' },
  { id: 'sup-25', sheetSupplier: 'Bathroom Mountain', category: 'Purchases', driveFolderMatches: 'Bathroom Mountain', canonicalName: 'Bathroom Mountain' },
  { id: 'sup-26', sheetSupplier: 'Bathroom Spare Parts', category: 'Purchases', driveFolderMatches: 'Bathroom Spare Parts', canonicalName: 'Bathroom Spare Parts' },
  { id: 'sup-27', sheetSupplier: 'Biasi Comfort Generation', category: 'Purchases', driveFolderMatches: 'Biasi Comfort Generation', canonicalName: 'BIASI BIASI COMFORT GENERATION | Biasi Comfort Generation | Biasi UK Ltd - Biasi Comfort Generation' },
  { id: 'sup-28', sheetSupplier: 'Blanco UK Limited', category: 'Purchases', driveFolderMatches: 'Blanco UK Limited', canonicalName: 'BLANCO | Blanco UK Limited' },
  { id: 'sup-29', sheetSupplier: 'BrightPay', category: 'Overhead/Service', driveFolderMatches: 'BrightPay', canonicalName: 'BrightPay' },
  { id: 'sup-30', sheetSupplier: 'Built Right', category: 'Purchases', driveFolderMatches: 'Built Right', canonicalName: 'Built Right' },
  { id: 'sup-31', sheetSupplier: 'C K Fires Limited', category: 'Purchases', driveFolderMatches: 'C K Fires Limited', canonicalName: 'C K Fires Limited' },
  { id: 'sup-32', sheetSupplier: 'CHEM UK LTD', category: 'Purchases', driveFolderMatches: 'Chem UK ltd', canonicalName: 'CHEM | CHEM UK LTD' },
  { id: 'sup-33', sheetSupplier: 'CWB Wholesale Ltd', category: 'Purchases', driveFolderMatches: 'CWB Wholesale Ltd', canonicalName: 'CWB Wholesale Ltd' },
  { id: 'sup-34', sheetSupplier: 'Cambabest', category: 'Purchases', driveFolderMatches: 'Cambabest', canonicalName: 'Cambabest' },
  { id: 'sup-35', sheetSupplier: 'Carisa Radiators Ltd', category: 'Purchases', driveFolderMatches: 'Carisa Radiators Ltd', canonicalName: 'Carisa Radiators Ltd' },
  { id: 'sup-36', sheetSupplier: 'Cashin Distributions UK Ltd C-tec', category: 'Purchases', driveFolderMatches: 'Cashin Distributions UK Ltd', canonicalName: 'CASHIN DISTRIBUTIONS C TEC | Cashin Distributions UK Ltd C-tec' },
  { id: 'sup-37', sheetSupplier: 'Central Services', category: 'Purchases', driveFolderMatches: 'Central Services', canonicalName: 'Central Services' },
  { id: 'sup-38', sheetSupplier: 'Ceramica Impex Limited', category: 'Purchases', driveFolderMatches: 'Ceramica Impex Limited', canonicalName: 'Ceramica Impex Limited' },
  { id: 'sup-39', sheetSupplier: 'Chelsea Supplies', category: 'Purchases', driveFolderMatches: 'Chelsea Supplies', canonicalName: 'Chelsea Supplies' },
  { id: 'sup-40', sheetSupplier: 'Circle Waste', category: 'Overhead/Service', driveFolderMatches: 'Circle Waste', canonicalName: 'Circle Waste' },
  { id: 'sup-41', sheetSupplier: 'City Plumbing', category: 'Purchases', driveFolderMatches: 'City Plumbing', canonicalName: 'City Plumbing' },
  { id: 'sup-42', sheetSupplier: 'Cloud Flare', category: 'Overhead/Service', driveFolderMatches: 'Cloud Flare', canonicalName: 'Cloud Flare' },
  { id: 'sup-43', sheetSupplier: 'Cloud Ways', category: 'Overhead/Service', driveFolderMatches: 'Cloudways', canonicalName: 'Cloud Ways' },
  { id: 'sup-44', sheetSupplier: 'Cloudways', category: 'Overhead/Service', driveFolderMatches: 'Cloudways', canonicalName: 'Cloud Ways' },
  { id: 'sup-45', sheetSupplier: 'Croydex', category: 'Purchases', driveFolderMatches: 'Croydex', canonicalName: 'Croydex' },
  { id: 'sup-46', sheetSupplier: 'Cubralco', category: 'Purchases', driveFolderMatches: 'Cubralco', canonicalName: 'Cubralco' },
  { id: 'sup-47', sheetSupplier: 'D R Kitchen Appliances Ltd.', category: 'Purchases', driveFolderMatches: 'D R Kitchen Appliances Ltd.', canonicalName: 'D R Kitchen Appliances Ltd.' },
  { id: 'sup-48', sheetSupplier: 'DYS Fortex LTD', category: 'Purchases', driveFolderMatches: 'DYS Fortex LTD', canonicalName: 'DYS Fortex LTD' },
  { id: 'sup-49', sheetSupplier: 'Dachser Limited', category: 'Overhead/Service', driveFolderMatches: 'Dachser Limited', canonicalName: 'Dachser Limited' },
  { id: 'sup-50', sheetSupplier: 'Delabie UK Ltd', category: 'Purchases', driveFolderMatches: 'Delabie UK Ltd', canonicalName: 'DELABIE | Delabie UK Ltd' },
  { id: 'sup-51', sheetSupplier: 'Delabie Uk Limited', category: 'Purchases', driveFolderMatches: 'Delabie UK Ltd', canonicalName: 'DELABIE | Delabie UK Ltd' },
  { id: 'sup-52', sheetSupplier: 'Dell Factor Ltd', category: 'Purchases', driveFolderMatches: 'Dell Factor Ltd', canonicalName: 'Dell Factor Ltd' },
  { id: 'sup-53', sheetSupplier: 'Demsun Uk Ltd', category: 'Purchases', driveFolderMatches: 'Demsun Uk Ltd', canonicalName: 'Demsun Uk Ltd' },
  { id: 'sup-54', sheetSupplier: 'Desire Bathrooms / Bathroom Bubbles', category: 'Purchases', driveFolderMatches: 'Desire Bathrooms', canonicalName: 'Desire Bathrooms / Bathroom Bubbles' },
  { id: 'sup-55', sheetSupplier: 'Di Vapor Ltd', category: 'Purchases', driveFolderMatches: 'Di Vapor Ltd', canonicalName: 'Di Vapor Ltd' },
  { id: 'sup-56', sheetSupplier: 'Digital Press', category: 'Overhead/Service', driveFolderMatches: 'Digital Press', canonicalName: 'Digital Press' },
  { id: 'sup-57', sheetSupplier: 'Direct Channel Support Systems', category: 'Purchases', driveFolderMatches: 'Direct Channel Support Systems', canonicalName: 'Direct Channel Support Systems' },
  { id: 'sup-58', sheetSupplier: 'Dru', category: 'Purchases', driveFolderMatches: 'Dru', canonicalName: 'Dru' },
  { id: 'sup-59', sheetSupplier: 'E.On Energy Solutions Limited', category: 'Overhead/Service', driveFolderMatches: 'E.On Energy Solutions Limited', canonicalName: 'E.On Energy Solutions Limited' },
  { id: 'sup-60', sheetSupplier: 'E.On Next Energy Solutions Limited', category: 'Overhead/Service', driveFolderMatches: 'E.On Energy Solutions Limited', canonicalName: 'E.On Next Energy Solutions Limited' },
  { id: 'sup-61', sheetSupplier: 'Eastbrook', category: 'Purchases', driveFolderMatches: 'Eastbrook', canonicalName: 'Eastbrook' },
  { id: 'sup-62', sheetSupplier: 'Ebay', category: 'Overhead/Service', driveFolderMatches: 'Ebay', canonicalName: 'Ebay' },
  { id: 'sup-63', sheetSupplier: 'Eco Wizard', category: 'Overhead/Service', driveFolderMatches: 'ECO Wizard', canonicalName: 'Eco Wizard' },
  { id: 'sup-64', sheetSupplier: 'Electricpoint', category: 'Purchases', driveFolderMatches: 'Electricpoint', canonicalName: 'Electricpoint' },
  { id: 'sup-65', sheetSupplier: 'Electrorad UK Ltd', category: 'Purchases', driveFolderMatches: 'Electrorad UK Ltd', canonicalName: 'Electrorad UK Ltd' },
  { id: 'sup-66', sheetSupplier: 'Element4', category: 'Purchases', driveFolderMatches: 'Element4', canonicalName: 'Element4' },
  { id: 'sup-67', sheetSupplier: 'Elesi Limited', category: 'Purchases', driveFolderMatches: 'Elesi Limited', canonicalName: 'Elesi Limited' },
  { id: 'sup-68', sheetSupplier: 'Elite Motors Bodyshop Limited', category: 'Overhead/Service', driveFolderMatches: 'Elite Motors Bodyshop Limited', canonicalName: 'Elite Motors Bodyshop Limited' },
  { id: 'sup-69', sheetSupplier: 'Ellsi Limited', category: 'Purchases', driveFolderMatches: 'Ellsi Limited', canonicalName: 'Ellsi Limited' },
  { id: 'sup-70', sheetSupplier: 'Enva', category: 'Overhead/Service', driveFolderMatches: 'Enva', canonicalName: 'Enva' },
  { id: 'sup-71', sheetSupplier: 'Euro Bathrooms Ltd', category: 'Purchases', driveFolderMatches: 'Euro Bathrooms Ltd', canonicalName: 'Euro Bathrooms Ltd' },
  { id: 'sup-72', sheetSupplier: 'Express Global International Ltd', category: 'Overhead/Service', driveFolderMatches: 'Express Global International Ltd', canonicalName: 'Express Global International Ltd' },
  { id: 'sup-73', sheetSupplier: 'F.H Brundle', category: 'Overhead/Service', driveFolderMatches: 'F.H.Brundle', canonicalName: 'F.H Brundle' },
  { id: 'sup-74', sheetSupplier: 'F1 Autocenters', category: 'Overhead/Service', driveFolderMatches: '', canonicalName: 'F1 Autocenters' },
  { id: 'sup-75', sheetSupplier: 'FM Products Ltd', category: 'Purchases', driveFolderMatches: 'FM Products Ltd', canonicalName: 'FM Products Ltd' },
  { id: 'sup-76', sheetSupplier: 'FW Hipkin Ltd', category: 'Purchases', driveFolderMatches: 'FW Hipkin Ltd', canonicalName: 'FW Hipkin Ltd' },
  { id: 'sup-77', sheetSupplier: 'Farmiloe', category: 'Purchases', driveFolderMatches: 'Farmiloe', canonicalName: 'Farmiloe' },
  { id: 'sup-78', sheetSupplier: 'Fast Freight Forward', category: 'Overhead/Service', driveFolderMatches: 'Fast Freight Forward', canonicalName: 'Fast Freight Forward' },
  { id: 'sup-79', sheetSupplier: 'Fastco (Fasters & Fixings) Ltd', category: 'Purchases', driveFolderMatches: 'Gator Fixings Limited', canonicalName: 'Fastco (Fasters & Fixings) Ltd' },
  { id: 'sup-80', sheetSupplier: 'Gator Fixings Limited', category: 'Purchases', driveFolderMatches: 'Gator Fixings Limited', canonicalName: 'Gator Fixings Limited' },
  { id: 'sup-81', sheetSupplier: 'Faucets Ltd', category: 'Purchases', driveFolderMatches: 'Faucets Ltd', canonicalName: 'Faucets Ltd' },
  { id: 'sup-82', sheetSupplier: 'Flavourr Granito Ltd', category: 'Purchases', driveFolderMatches: 'Flavourr Granito Ltd', canonicalName: 'Flavourr Granito Ltd' },
  { id: 'sup-83', sheetSupplier: 'Flipfix Ltd', category: 'Purchases', driveFolderMatches: 'Flipfix Ltd', canonicalName: 'Flipfix Ltd' },
  { id: 'sup-84', sheetSupplier: 'Flocon Valves & Fittings Ltd', category: 'Purchases', driveFolderMatches: 'Flocon Valves & Fittings Ltd', canonicalName: 'Flocon Valves & Fittings Ltd' },
  { id: 'sup-85', sheetSupplier: 'Focal Point Fires', category: 'Purchases', driveFolderMatches: 'Focal Point Fires', canonicalName: 'Focal Point Fires' },
  { id: 'sup-86', sheetSupplier: 'FreightCore Limited', category: 'Overhead/Service', driveFolderMatches: 'FreightCore Limited', canonicalName: 'FreightCore Limited' },
  { id: 'sup-87', sheetSupplier: 'Frontline Bathrooms Ltd', category: 'Purchases', driveFolderMatches: 'Frontline Bathrooms Ltd', canonicalName: 'Frontline Bathrooms Ltd' },
  { id: 'sup-88', sheetSupplier: 'G4S Secure Solutions (UK) Limited', category: 'Overhead/Service', driveFolderMatches: 'G4S Secure Solutions (UK) Limited', canonicalName: 'G4S Secure Solutions (UK) Limited' },
  { id: 'sup-89', sheetSupplier: 'GCS Genesis Commercial Solutions Limited', category: 'Purchases', driveFolderMatches: 'GCS Genesis Commercial Solutions Limited', canonicalName: 'GCS Genesis Commercial Solutions Limited' },
  { id: 'sup-90', sheetSupplier: 'GO-EPT Ltd', category: 'Overhead/Service', driveFolderMatches: 'Go-EPT Ltd', canonicalName: 'GO-EPT Ltd' },
  { id: 'sup-91', sheetSupplier: 'GS1 UK', category: 'Overhead/Service', driveFolderMatches: 'GS1 UK', canonicalName: 'GS1 | GS1 UK' },
  { id: 'sup-92', sheetSupplier: 'GTR Training Services Ltd', category: 'Overhead/Service', driveFolderMatches: 'GTR Training Services Ltd', canonicalName: 'GTR Training Services Ltd' },
  { id: 'sup-93', sheetSupplier: 'Gala Technology Limited', category: 'Overhead/Service', driveFolderMatches: 'Gala Technology Limited', canonicalName: 'Gala Technology Limited' },
  { id: 'sup-94', sheetSupplier: 'Gas Bottles Limited', category: 'Purchases', driveFolderMatches: 'Gas Bottles Limited', canonicalName: 'Gas Bottles Limited' },
  { id: 'sup-95', sheetSupplier: 'Gas Parts Direct Leicester', category: 'Purchases', driveFolderMatches: 'Gas Parts Direct Leicester', canonicalName: 'Gas Parts Direct Leicester' },
  { id: 'sup-96', sheetSupplier: 'Gazco Limited', category: 'Purchases', driveFolderMatches: 'Gazco Limited', canonicalName: 'Gazco Limited' },
  { id: 'sup-97', sheetSupplier: 'Gledhill Building Products Ltd', category: 'Purchases', driveFolderMatches: 'Gledhill Building Products Ltd', canonicalName: 'Gledhill Building Products Ltd' },
  { id: 'sup-98', sheetSupplier: 'Global Experience Specialists (GES) Ltd', category: 'Overhead/Service', driveFolderMatches: 'Global Experience Specialists (GES) Ltd', canonicalName: 'Global Experience Specialists (GES) Ltd' },
  { id: 'sup-99', sheetSupplier: 'Golita Supplies Ltd', category: 'Purchases', driveFolderMatches: 'Golita Supplies Ltd', canonicalName: 'Golita Supplies Ltd' },
  { id: 'sup-100', sheetSupplier: 'BAP Supplies Limited', category: 'Purchases', driveFolderMatches: 'BAP Supplies Limited', canonicalName: 'BAP Supplies Limited' },
  { id: 'sup-101', sheetSupplier: 'Greta Grove', category: 'Purchases', driveFolderMatches: 'Greta Grove', canonicalName: 'Greta Grove' },
  { id: 'sup-102', sheetSupplier: 'H&V Controls', category: 'Purchases', driveFolderMatches: 'H&V Controls', canonicalName: 'H&V Controls' },
  { id: 'sup-103', sheetSupplier: 'Harmony Surfaces UK Limited', category: 'Purchases', driveFolderMatches: 'Harmony Surface UK Limited', canonicalName: 'HARMONY SURFACES | Harmony Surfaces UK Limited' },
  { id: 'sup-104', sheetSupplier: 'Harrison Bathrooms Ltd', category: 'Overhead/Service', driveFolderMatches: 'Harrison Bathrooms Ltd', canonicalName: 'Harrison Bathrooms Ltd' },
  { id: 'sup-105', sheetSupplier: 'Hermes Parcelnet Ltd', category: 'Overhead/Service', driveFolderMatches: 'Hermes Parcelnet Ltd', canonicalName: 'Hermes Parcelnet Ltd' },
  { id: 'sup-106', sheetSupplier: 'Hetta Systems UK', category: 'Purchases', driveFolderMatches: 'Hetta Systems UK', canonicalName: 'Hetta Systems UK' },
  { id: 'sup-107', sheetSupplier: 'Hot Water Sales Ltd', category: 'Purchases', driveFolderMatches: 'Hot Water Sales Ltd', canonicalName: 'Hot Water Sales Ltd' },
  { id: 'sup-108', sheetSupplier: 'Hyco', category: 'Purchases', driveFolderMatches: 'Hyco', canonicalName: 'Hyco' },
  { id: 'sup-109', sheetSupplier: 'I LOVE PDF', category: 'Overhead/Service', driveFolderMatches: 'I Love PDF', canonicalName: 'I LOVE PDF' },
  { id: 'sup-110', sheetSupplier: 'IntCeram', category: 'Purchases', driveFolderMatches: 'IntCeram Ltd', canonicalName: 'IntCeram Limited' },
  { id: 'sup-111', sheetSupplier: 'IntCeram Limited', category: 'Purchases', driveFolderMatches: 'IntCeram Ltd', canonicalName: 'IntCeram Limited' },
  { id: 'sup-112', sheetSupplier: 'JSK & Transport LTD', category: 'Overhead/Service', driveFolderMatches: 'JSK & Transport LTD', canonicalName: 'JSK & Transport LTD' },
  { id: 'sup-113', sheetSupplier: 'Jonen Shipping (Midlands) Ltd', category: 'Overhead/Service', driveFolderMatches: 'Jonen Shipping (Midlands) Ltd', canonicalName: 'Jonen Shipping (Midlands) Ltd' },
  { id: 'sup-114', sheetSupplier: 'Junction2 Interiors', category: 'Overhead/Service', driveFolderMatches: 'Junction2 Interiors', canonicalName: 'Junction2 Interiors' },
  { id: 'sup-115', sheetSupplier: 'Just Radiators', category: 'Purchases', driveFolderMatches: 'Just Radiators', canonicalName: 'Just Radiators' },
  { id: 'sup-116', sheetSupplier: 'Just Taps Plus', category: 'Purchases', driveFolderMatches: 'Just Taps Plus', canonicalName: 'Just Taps Plus' },
  { id: 'sup-117', sheetSupplier: 'KDK Bathroom Ware Ltd', category: 'Purchases', driveFolderMatches: 'KDK Bathroom Ware Ltd', canonicalName: 'KDK Bathroom Ware Ltd' },
  { id: 'sup-118', sheetSupplier: 'Karcher Outlet', category: 'Purchases', driveFolderMatches: 'Karcher Outlet', canonicalName: 'Karcher Outlet' },
  { id: 'sup-119', sheetSupplier: 'Kartell Uk Ltd', category: 'Purchases', driveFolderMatches: 'Kartell Uk Ltd', canonicalName: 'KARTELL | Kartell Uk Ltd' },
  { id: 'sup-120', sheetSupplier: 'Kite Packaging', category: 'Purchases', driveFolderMatches: 'Kite Packaging', canonicalName: 'Kite Packaging' },
  { id: 'sup-121', sheetSupplier: 'Krobahn Ltd', category: 'Purchases', driveFolderMatches: 'Krobahn Ltd', canonicalName: 'Krobahn Ltd' },
  { id: 'sup-122', sheetSupplier: 'L & M Heating Supplies Ltd', category: 'Purchases', driveFolderMatches: 'L & M Heating Supplies Ltd', canonicalName: 'L & M Heating Supplies Ltd' },
  { id: 'sup-123', sheetSupplier: 'L.E.I.C Ltd', category: 'Overhead/Service', driveFolderMatches: 'L.E.I.C Ltd', canonicalName: 'L.E.I.C Ltd' },
  { id: 'sup-124', sheetSupplier: 'Lakeside Distribution Leicester Ltd', category: 'Purchases', driveFolderMatches: 'Lakeside Distribution Leicester Ltd', canonicalName: 'Lakeside Distribution Leicester Ltd' },
  { id: 'sup-125', sheetSupplier: 'Lawton Tube', category: 'Purchases', driveFolderMatches: 'Lawton Tube', canonicalName: 'Lawton Tube' },
  { id: 'sup-126', sheetSupplier: 'Lazura Ltd', category: 'Purchases', driveFolderMatches: 'Lazura Ltd', canonicalName: 'Lazura Ltd' },
  { id: 'sup-127', sheetSupplier: 'Leicester Forklifts Ltd', category: 'Overhead/Service', driveFolderMatches: 'Leicester Forklifts Ltd', canonicalName: 'Leicester Forklifts Ltd' },
  { id: 'sup-128', sheetSupplier: 'Livebuzz', category: 'Overhead/Service', driveFolderMatches: 'Livebuzz', canonicalName: 'Livebuzz' },
  { id: 'sup-129', sheetSupplier: 'Lyrical Communications Ltd', category: 'Overhead/Service', driveFolderMatches: 'Lyrical Communication Ltd', canonicalName: 'Lyrical Communications Ltd' },
  { id: 'sup-130', sheetSupplier: 'M Brothers Automative', category: 'Overhead/Service', driveFolderMatches: 'M-Brothers Automotive Ltd', canonicalName: 'M Brothers Automative' },
  { id: 'sup-131', sheetSupplier: 'M-Brothers Automotive Ltd', category: 'Overhead/Service', driveFolderMatches: 'M-Brothers Automotive Ltd', canonicalName: 'M-Brothers Automotive Ltd' },
  { id: 'sup-132', sheetSupplier: 'MG Recycling Limited', category: 'Overhead/Service', driveFolderMatches: 'MG Recycling Limited', canonicalName: 'MG Recycling Limited' },
  { id: 'sup-133', sheetSupplier: 'MHS Radiators Limited', category: 'Purchases', driveFolderMatches: 'MHS Radiators Limited', canonicalName: 'MHS Radiators Limited' },
  { id: 'sup-134', sheetSupplier: 'MWM Distributors Ltd', category: 'Purchases', driveFolderMatches: 'MWM Distributors Ltd', canonicalName: 'MWM Distributors Ltd' },
  { id: 'sup-135', sheetSupplier: 'Mano Mano', category: 'Overhead/Service', driveFolderMatches: 'Mano Mano', canonicalName: 'Mano Mano' },
  { id: 'sup-136', sheetSupplier: 'Matki Plc', category: 'Purchases', driveFolderMatches: 'Matki Plc', canonicalName: 'Matki Plc' },
  { id: 'sup-137', sheetSupplier: 'Mercantile Ventures Ltd', category: 'Purchases', driveFolderMatches: 'Mercantile Ventures Ltd', canonicalName: 'Mercantile Ventures Ltd' },
  { id: 'sup-138', sheetSupplier: 'Metal Store', category: 'Purchases', driveFolderMatches: 'Metal Store', canonicalName: 'Metal Store | The Metal Store' },
  { id: 'sup-139', sheetSupplier: 'Metro Fixings Ltd', category: 'Purchases', driveFolderMatches: 'Metro Fixings Ltd', canonicalName: 'Metro Fixings Ltd' },
  { id: 'sup-140', sheetSupplier: 'Michael Pavis Limited', category: 'Purchases', driveFolderMatches: 'Michael Pavis Limited', canonicalName: 'Michael Pavis Limited' },
  { id: 'sup-141', sheetSupplier: 'Microsoft', category: 'Overhead/Service', driveFolderMatches: 'Microsoft', canonicalName: 'Microsoft' },
  { id: 'sup-142', sheetSupplier: 'Midwest Fork Lift Services', category: 'Overhead/Service', driveFolderMatches: 'Midwest Fork Lift Services', canonicalName: 'Midwest Fork Lift Services' },
  { id: 'sup-143', sheetSupplier: 'Monster Plumb Limited', category: 'Purchases', driveFolderMatches: 'Monster Plumb Ltd', canonicalName: 'Monster Plumb Limited' },
  { id: 'sup-144', sheetSupplier: 'Murkz Concrete Products', category: 'Purchases', driveFolderMatches: 'Murkz Concrete Products', canonicalName: 'Murkz Concrete Products' },
  { id: 'sup-145', sheetSupplier: 'N & C Building Products Ltd', category: 'Purchases', driveFolderMatches: 'N & C Building Products Ltd', canonicalName: 'N & C Building Products Ltd' },
  { id: 'sup-146', sheetSupplier: 'NMBS', category: 'Purchases', driveFolderMatches: 'NMBS', canonicalName: 'NMBS' },
  { id: 'sup-147', sheetSupplier: 'Neon Web', category: 'Overhead/Service', driveFolderMatches: 'Neon Web', canonicalName: 'Neon Web' },
  { id: 'sup-148', sheetSupplier: 'Nerrad Tools', category: 'Overhead/Service', driveFolderMatches: 'Nerrad Tools', canonicalName: 'Nerrad Tools' },
  { id: 'sup-149', sheetSupplier: 'Northern Sink Supplies Ltd', category: 'Purchases', driveFolderMatches: 'Northern Sink Supplies Ltd', canonicalName: 'Northern Sink Supplies Ltd' },
  { id: 'sup-150', sheetSupplier: 'Oadby Plastics Limited', category: 'Purchases', driveFolderMatches: 'Oadby Plastics Limited', canonicalName: 'Oadby Plastics Limited' },
  { id: 'sup-151', sheetSupplier: 'Parcel Force', category: 'Overhead/Service', driveFolderMatches: 'Parcel Force', canonicalName: 'Parcel Force' },
  { id: 'sup-152', sheetSupplier: 'Parcel Hero', category: 'Overhead/Service', driveFolderMatches: 'Parcel Hero', canonicalName: 'Parcel Hero' },
  { id: 'sup-153', sheetSupplier: 'Parcelrite Limited', category: 'Overhead/Service', driveFolderMatches: 'Parcelrite Ltd', canonicalName: 'Parcelrite Limited' },
  { id: 'sup-154', sheetSupplier: 'Penniment Plumbing & Heating', category: 'Overhead/Service', driveFolderMatches: 'Penniment Plumbing & Heating', canonicalName: 'Penniment Plumbing & Heating | Plumbing & Heating' },
  { id: 'sup-155', sheetSupplier: 'Pioneer Bathrooms Ltd', category: 'Purchases', driveFolderMatches: 'Pioneer Bathrooms Ltd', canonicalName: 'Pioneer Bathrooms Ltd' },
  { id: 'sup-156', sheetSupplier: 'Pitacs', category: 'Purchases', driveFolderMatches: 'Pitacs', canonicalName: 'Pitacs' },
  { id: 'sup-157', sheetSupplier: 'Plastic Pipe Shop', category: 'Purchases', driveFolderMatches: 'Plastic Pipe Shop', canonicalName: 'Plastic Pipe Shop' },
  { id: 'sup-158', sheetSupplier: 'Plumb Distribution Ltd', category: 'Purchases', driveFolderMatches: 'Plumb Distribution Ltd', canonicalName: 'Plumb Distribution Ltd' },
  { id: 'sup-159', sheetSupplier: 'Plumb Nation', category: 'Purchases', driveFolderMatches: 'Plumbnation', canonicalName: 'Plumb Nation' },
  { id: 'sup-160', sheetSupplier: 'Plumb2u', category: 'Purchases', driveFolderMatches: 'Plumb2u', canonicalName: 'Plumb2u' },
  { id: 'sup-161', sheetSupplier: 'Plumbing & Heating', category: 'Purchases', driveFolderMatches: 'Plumbing & Heating', canonicalName: 'Plumbing & Heating' },
  { id: 'sup-162', sheetSupplier: 'Plumbing Super Store', category: 'Purchases', driveFolderMatches: 'Plumbing Superstore', canonicalName: 'CMO Superstores Ltd. / Plumbing Superstore | Plumbing Super Store' },
  { id: 'sup-163', sheetSupplier: 'Plumbworld', category: 'Purchases', driveFolderMatches: 'Plumbworld', canonicalName: 'Plumbworld' },
  { id: 'sup-164', sheetSupplier: 'Porcelgres', category: 'Purchases', driveFolderMatches: 'Porcel Gres', canonicalName: 'Porcelgres' },
  { id: 'sup-165', sheetSupplier: 'Power Tool Centre Ltd', category: 'Purchases', driveFolderMatches: 'Power Tool Centre Ltd.', canonicalName: 'Power Tool Centre Ltd' },
  { id: 'sup-166', sheetSupplier: 'Primaflow / F&P', category: 'Purchases', driveFolderMatches: 'Primaflow', canonicalName: 'Primaflow / F&P' },
  { id: 'sup-167', sheetSupplier: 'Prime Tools', category: 'Purchases', driveFolderMatches: 'Prime Tools', canonicalName: 'Prime Tools' },
  { id: 'sup-168', sheetSupplier: 'Print Berry', category: 'Overhead/Service', driveFolderMatches: 'Print Berry', canonicalName: 'Print Berry' },
  { id: 'sup-169', sheetSupplier: 'QX Bathroom Products', category: 'Purchases', driveFolderMatches: 'QX Bathroom Products', canonicalName: 'QX Bathroom Products' },
  { id: 'sup-170', sheetSupplier: 'Quest 4 Ltd / Q4', category: 'Purchases', driveFolderMatches: 'QX Bathroom Products | Quest 4 Ltd', canonicalName: 'QX Bathroom Products' },
  { id: 'sup-171', sheetSupplier: 'Radiator Outlet', category: 'Purchases', driveFolderMatches: 'Radiator Outlet', canonicalName: 'Radiator Outlet' },
  { id: 'sup-172', sheetSupplier: 'Radius Vehicle Solutions Limited', category: 'Overhead/Service', driveFolderMatches: 'Radius Vehicle Solutions Limited', canonicalName: 'Radius Vehicle Solutions Limited' },
  { id: 'sup-173', sheetSupplier: 'Reginox UK Ltd', category: 'Purchases', driveFolderMatches: 'Reginox UK Ltd', canonicalName: 'REGINOX | Reginox UK Ltd' },
  { id: 'sup-174', sheetSupplier: 'Reina', category: 'Purchases', driveFolderMatches: 'Reina', canonicalName: 'Reina' },
  { id: 'sup-175', sheetSupplier: 'Reliable UK Trading Co., Ltd', category: 'Purchases', driveFolderMatches: 'Reliable UK Trading Co., Ltd', canonicalName: 'Reliable UK Trading Co., Ltd' },
  { id: 'sup-176', sheetSupplier: 'Remote Asset Management Ltd', category: 'Overhead/Service', driveFolderMatches: 'Remote Asset Management Ltd', canonicalName: 'Remote Asset Management Ltd' },
  { id: 'sup-177', sheetSupplier: 'Rems Uk Ltd', category: 'Purchases', driveFolderMatches: 'REMS Uk Ltd', canonicalName: 'REMS | Rems Uk Ltd' },
  { id: 'sup-178', sheetSupplier: 'Roper Rhodes Ltd', category: 'Purchases', driveFolderMatches: 'Roper Rhodes Ltd', canonicalName: 'Roper Rhodes Ltd' },
  { id: 'sup-179', sheetSupplier: 'S&A Imports Ltd (Bathroom & Wetwall Warehouse)', category: 'Purchases', driveFolderMatches: 'S & A Import Ltd', canonicalName: 'S&A Imports Ltd (Bathroom & Wetwall Warehouse)' },
  { id: 'sup-180', sheetSupplier: 'Safescan', category: 'Overhead/Service', driveFolderMatches: 'Safescan', canonicalName: 'Safescan' },
  { id: 'sup-181', sheetSupplier: 'Sam Auto Centre', category: 'Overhead/Service', driveFolderMatches: 'SAM Auto Centre', canonicalName: 'Sam Auto Centre' },
  { id: 'sup-182', sheetSupplier: 'Samsung', category: 'Overhead/Service', driveFolderMatches: 'Samsung Electronics UK Ltd', canonicalName: 'Samsung' },
  { id: 'sup-183', sheetSupplier: 'Sanica Building Materials Limited', category: 'Purchases', driveFolderMatches: 'Sanica Building Materials Limited', canonicalName: 'Sanica Building Materials Limited' },
  { id: 'sup-184', sheetSupplier: 'Screwfix Direct Ltd', category: 'Purchases', driveFolderMatches: 'Screwfix Direct Ltd', canonicalName: 'SCREWFIX DIRECT LTD / TRADE | Screwfix Direct Ltd | Screwfix Direct Ltd / Trade UK' },
  { id: 'sup-185', sheetSupplier: 'Sil Tyres', category: 'Overhead/Service', driveFolderMatches: 'Sil Tyres', canonicalName: 'Sil Tyres' },
  { id: 'sup-186', sheetSupplier: 'Smart Transport & Logistics Ltd', category: 'Overhead/Service', driveFolderMatches: 'Smart Transport & Logistics', canonicalName: 'Smart Transport & Logistics Ltd' },
  { id: 'sup-187', sheetSupplier: 'Smith Brothers Stores Ltd', category: 'Purchases', driveFolderMatches: 'Smith Brothers Stores Ltd', canonicalName: 'Smith Brothers Stores Ltd' },
  { id: 'sup-188', sheetSupplier: 'Sterling', category: 'Purchases', driveFolderMatches: 'Sterling', canonicalName: 'Sterling' },
  { id: 'sup-189', sheetSupplier: 'Sterr', category: 'Purchases', driveFolderMatches: 'Sterr', canonicalName: 'Sterr' },
  { id: 'sup-190', sheetSupplier: 'Stonebridge Corporate Insurance Solutions', category: 'Overhead/Service', driveFolderMatches: 'Stonebridge Corporate Insurance Solutions', canonicalName: 'Stonebridge Corporate Insurance Solutions' },
  { id: 'sup-191', sheetSupplier: 'Stonebridge Trading Estate', category: 'Overhead/Service', driveFolderMatches: 'Stonebridge Corporate Insurance Solutions', canonicalName: 'Stonebridge Trading Estate' },
  { id: 'sup-192', sheetSupplier: 'Strip Curtains Direct', category: 'Overhead/Service', driveFolderMatches: 'Strip Curtains Direct', canonicalName: 'Strip Curtains Direct' },
  { id: 'sup-193', sheetSupplier: 'TFC Group LLP', category: 'Purchases', driveFolderMatches: 'TFC Group LLP', canonicalName: 'TFC Group LLP' },
  { id: 'sup-194', sheetSupplier: 'Tavistock', category: 'Purchases', driveFolderMatches: 'Tavistock', canonicalName: 'Tavistock' },
  { id: 'sup-195', sheetSupplier: 'Tax Optimiser Ltd', category: 'Overhead/Service', driveFolderMatches: 'Tax Optimiser', canonicalName: 'Tax Optimiser Ltd' },
  { id: 'sup-196', sheetSupplier: 'Teya Solutions Ltd', category: 'Overhead/Service', driveFolderMatches: 'Teya', canonicalName: 'Teya Solutions Ltd' },
  { id: 'sup-197', sheetSupplier: 'The Mosaic Tile Company/Verona', category: 'Purchases', driveFolderMatches: 'The Mosaic Tile Company Verona', canonicalName: 'The Mosaic Tile Company/Verona' },
  { id: 'sup-198', sheetSupplier: 'The Shower Seal Shop', category: 'Purchases', driveFolderMatches: 'The Shower Seal Shop', canonicalName: 'The Shower Seal Shop' },
  { id: 'sup-199', sheetSupplier: 'Thermo Sphere', category: 'Purchases', driveFolderMatches: 'Thermo Sphere', canonicalName: 'Thermo Sphere' },
  { id: 'sup-200', sheetSupplier: 'Thomas Dudley Ltd / Tyde', category: 'Purchases', driveFolderMatches: 'Thomas Dudley Ltd', canonicalName: 'Thomas Dudley Ltd / Tyde' },
  { id: 'sup-201', sheetSupplier: 'Tile Mountain', category: 'Overhead/Service', driveFolderMatches: 'Tile Mountain', canonicalName: 'Bathroom Mountain | Tile Mountain' },
  { id: 'sup-202', sheetSupplier: 'Tile Pal', category: 'Purchases', driveFolderMatches: 'Tile Pal || Quantum', canonicalName: 'Tile Pal' },
  { id: 'sup-203', sheetSupplier: 'Tileasy Ltd', category: 'Purchases', driveFolderMatches: 'Tileasy Ltd', canonicalName: 'Tileasy Ltd' },
  { id: 'sup-204', sheetSupplier: 'Tiles Direct', category: 'Purchases', driveFolderMatches: 'Tiles Direct Trading / Tile Enterprise Ltd', canonicalName: 'Tiles Direct | Tiles Direct trading as Tile Enterprise Ltd' },
  { id: 'sup-205', sheetSupplier: 'Time Doctor', category: 'Overhead/Service', driveFolderMatches: 'Time Doctor', canonicalName: 'Time Doctor' },
  { id: 'sup-206', sheetSupplier: 'Time Moto', category: 'Overhead/Service', driveFolderMatches: 'Time Moto', canonicalName: 'Time Moto' },
  { id: 'sup-207', sheetSupplier: 'Todays Tools Limited', category: 'Purchases', driveFolderMatches: 'Todays Tools Limited', canonicalName: 'Todays Tools Limited' },
  { id: 'sup-208', sheetSupplier: 'Toiletspares Ltd', category: 'Purchases', driveFolderMatches: 'Toiletspare Ltd', canonicalName: 'Toiletspares Ltd' },
  { id: 'sup-209', sheetSupplier: 'Toolden', category: 'Purchases', driveFolderMatches: 'Toolden Limited', canonicalName: 'Toolden' },
  { id: 'sup-210', sheetSupplier: 'Toolstation Ltd', category: 'Purchases', driveFolderMatches: 'Toolstation Ltd', canonicalName: 'Toolstation Ltd' },
  { id: 'sup-211', sheetSupplier: 'Towel Rads', category: 'Purchases', driveFolderMatches: 'Towel Rads', canonicalName: 'Towel Rads' },
  { id: 'sup-212', sheetSupplier: 'Transltr Limited', category: 'Overhead/Service', driveFolderMatches: 'Transltr Limited', canonicalName: 'Transltr Limited' },
  { id: 'sup-213', sheetSupplier: 'Travis Perkins', category: 'Purchases', driveFolderMatches: 'Travis Perkins', canonicalName: 'Travis Perkins' },
  { id: 'sup-214', sheetSupplier: 'Trustpilot', category: 'Overhead/Service', driveFolderMatches: 'Trustpilot', canonicalName: 'Trustpilot' },
  { id: 'sup-215', sheetSupplier: 'Tyres & Wheels', category: 'Overhead/Service', driveFolderMatches: 'Tyres & Wheels', canonicalName: 'Tyres & Wheels' },
  { id: 'sup-216', sheetSupplier: 'UHeat', category: 'Overhead/Service', driveFolderMatches: '', canonicalName: 'UHeat' },
  { id: 'sup-217', sheetSupplier: 'UK Plastics Walsall Limited', category: 'Purchases', driveFolderMatches: 'UK Plastics Walsall Limited', canonicalName: 'PLASTICS WALSALL | UK Plastics (Walsall) Limited / Walsall | UK Plastics Walsall Limited' },
  { id: 'sup-218', sheetSupplier: 'Unique Forwarding Limited', category: 'Overhead/Service', driveFolderMatches: 'Unique Forwarding Limited', canonicalName: 'Unique Forwarding Limited' },
  { id: 'sup-219', sheetSupplier: 'Unvented Components Europe Limited', category: 'Purchases', driveFolderMatches: 'Unvented Components Europe Limited', canonicalName: 'Unvented Components Europe Limited' },
  { id: 'sup-220', sheetSupplier: 'Valda Energy Solution', category: 'Overhead/Service', driveFolderMatches: 'Valda Energy', canonicalName: 'Valda Energy Solution' },
  { id: 'sup-221', sheetSupplier: 'Victorian Plumbing', category: 'Purchases', driveFolderMatches: 'Victorian Plumbing Ltd', canonicalName: 'Victorian Plumbing' },
  { id: 'sup-222', sheetSupplier: 'Vodafone', category: 'Overhead/Service', driveFolderMatches: 'Vodafone Limited', canonicalName: 'Vodafone Limited' },
  { id: 'sup-223', sheetSupplier: 'Vodafone Limited', category: 'Overhead/Service', driveFolderMatches: 'Vodafone Limited', canonicalName: 'Vodafone Limited' },
  { id: 'sup-224', sheetSupplier: 'WRPM Whitemore Reans Plumbers Merchants Ltd', category: 'Purchases', driveFolderMatches: 'WRPM Whitemore Reans Plumbers Merchants Ltd', canonicalName: 'WRPM Whitemore Reans Plumbers Merchants Ltd | Whitmore Reans Plumbers Merchants Ltd - WRPM LTD.' },
  { id: 'sup-225', sheetSupplier: 'WT Randall Ltd', category: 'Purchases', driveFolderMatches: 'WT Randall Ltd', canonicalName: 'WT Randall Ltd' },
  { id: 'sup-226', sheetSupplier: 'Walls & Floors Limited', category: 'Purchases', driveFolderMatches: 'Walls & Floors Limited', canonicalName: 'Walls & Floors Limited' },
  { id: 'sup-227', sheetSupplier: 'Warmhaus Heating Limited', category: 'Purchases', driveFolderMatches: 'Warmhaus Heating Limited', canonicalName: 'Warmhaus Heating Limited' },
  { id: 'sup-228', sheetSupplier: 'Water Plus', category: 'Overhead/Service', driveFolderMatches: 'Water Plus', canonicalName: 'Water Plus' },
  { id: 'sup-229', sheetSupplier: 'Watergates Ltd', category: 'Overhead/Service', driveFolderMatches: 'Watergates Ltd', canonicalName: 'Watergates Ltd' },
  { id: 'sup-230', sheetSupplier: 'Wolseley UK Limited', category: 'Purchases', driveFolderMatches: 'Wolseley UK Limited', canonicalName: 'WOLSELEY | Wolseley UK Limited' },
  { id: 'sup-231', sheetSupplier: 'Worldpay UK Limited', category: 'Overhead/Service', driveFolderMatches: 'Worldpay UK Limited', canonicalName: 'WORLDPAY | Worldpay UK Limited' },
  { id: 'sup-232', sheetSupplier: 'Y AND A Supplies Ltd', category: 'Purchases', driveFolderMatches: 'Y AND A Supplies Ltd', canonicalName: 'Y AND A Supplies Ltd' },
];

/**
 * Normalizes a raw supplier string from a spreadsheet by matching it against
 * the configured supplier normalization dictionary.
 */
export function resolveSupplier(rawName: string, customMappings: SupplierMapping[] = MASTER_SUPPLIER_MAPPINGS): {
  canonicalName: string;
  driveFolderNames: string[];
  matchedMapping?: SupplierMapping;
} {
  const cleanRaw = rawName.trim().toLowerCase();
  if (!cleanRaw) {
    return { canonicalName: 'Unknown Supplier', driveFolderNames: ['Unknown Supplier'] };
  }

  // 1. Direct or fuzzy match against sheetSupplier or canonicalName
  const match = customMappings.find((m) => {
    const sName = m.sheetSupplier.trim().toLowerCase();
    const cName = m.canonicalName.trim().toLowerCase();
    if (cleanRaw === sName || cleanRaw === cName) return true;

    // Check alias list inside canonicalName (e.g. "BLANCO | Blanco UK Limited")
    const aliases = m.canonicalName.split(/[|/]+/).map((a) => a.trim().toLowerCase());
    if (aliases.includes(cleanRaw)) return true;

    // Check drive folder match aliases
    const folderAliases = m.driveFolderMatches.split(/[|/]+/).map((f) => f.trim().toLowerCase());
    if (folderAliases.includes(cleanRaw)) return true;

    // Clean comparison removing Ltd, Limited, Co, Corp, UK
    const stripCorp = (t: string) =>
      t.replace(/(\bltd\b|\blimited\b|\bco\b|\bcorp\b|\buk\b|[.,&])/gi, '').replace(/\s+/g, ' ').trim();
    if (stripCorp(cleanRaw) && stripCorp(cleanRaw) === stripCorp(sName)) return true;

    return false;
  });

  if (match) {
    // Collect all expected folder names in Drive
    const folderNamesSet = new Set<string>();
    if (match.driveFolderMatches && match.driveFolderMatches.trim()) {
      match.driveFolderMatches.split(/[|/]+/).forEach((f) => {
        const tr = f.trim();
        if (tr) folderNamesSet.add(tr);
      });
    }
    if (match.canonicalName) {
      match.canonicalName.split(/[|/]+/).forEach((c) => {
        const tr = c.trim();
        if (tr) folderNamesSet.add(tr);
      });
    }
    folderNamesSet.add(match.sheetSupplier.trim());

    return {
      canonicalName: match.canonicalName || match.sheetSupplier,
      driveFolderNames: Array.from(folderNamesSet),
      matchedMapping: match,
    };
  }

  // Default fallback if not found in table
  return {
    canonicalName: rawName.trim(),
    driveFolderNames: [rawName.trim()],
  };
}
