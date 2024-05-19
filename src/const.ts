import type { JwtName } from './enum';
import { env } from '@/validators';

const mediciness = [
  'Abacavir',
  'Abrocitinib',
  'Acarbose',
  'ACEInhibitor',
  'Acebutolol',
  'Acetazolamide',
  'Acetylcysteine',
  'AcetylcysteineInhalasi',
  'Acitretin',
  'Aclidinium',
  'Actemra',
  'Actifed',
  'AcyclovirTablet',
  'AcyclovirTopikal',
  'Adalimumab',
  'Adapalene',
  'Adefovir',
  'Adenosine',
  'AgonisBeta',
  'AilinCool',
  'Albendazole',
  'Albumin',
  'Alendronate',
  'Alfentanil',
  'Alfuzosin',
  'Aliskiren',
  'Alitretinoin',
  'Allopurinol',
  'Allylestrenol',
  'Alogliptin',
  'Alpara',
  'Alpha-LipoicAcid',
  'Alprazolam',
  'Alteplase',
  'AluminiumHidroksida',
  'Ambroxol',
  'AmbroxolIndofarma',
  'Amfetamin',
  'Amikacin',
  'AmilNitrit',
  'Amiloride',
  'Aminofilin',
  'Aminoglikosida',
  'AminolevulinicAcid',
  'Amiodarone',
  'Amitriptyline',
  'Amlodipine',
  'AmlodipineHexpharm',
  'Amobarbital',
  'AmoniumKlorida',
  'Amoxicillin',
  'AmoxicillinIndofarma/KimiaFarma',
  'Amoxillin',
  'AmphotericinB',
  'Ampicillin',
  'Amylmetacresol',
  'Anagrelide',
  'Anakinra',
  'Analgetik-Antipiretik',
  'AnastanForte',
  'Anastrozole',
  'Anidulafungin',
  'AntagonisH2',
  'AntagonisKalsium',
  'Antalgin',
  'AntanginJRG',
  'Antasida',
  'Antiansietas',
  'Antiaritmia',
  'Antibiotik',
  'AntibiotikPolipeptida',
  'Antidepresan',
  'AntidepresanTrisiklik',
  'Antiemetik',
  'Antihistamin',
  'Antijamur',
  'Antikoagulan',
  'Antikolinergik',
  'Antikonvulsan',
  'Antimalaria',
  'Antimania',
  'Antimo',
  'Antiplatelet',
  'Antipsikotik',
  'Antiretroviral',
  'Antitetanus',
  'Apalutamide',
  'Apixaban',
  'Aptor',
  'ARB',
  'Arginine',
  'Aripiprazole',
  'Artemether',
  'Artesunate',
  'AsamAlginat',
  'AsamBoratTetesTelinga',
  'AsamFusidat',
  'AsamGlikolat',
  'AsamHialuronat',
  'AsamMefenamat',
  'AsamPipemidat',
  'AsamSalisilat',
  'AsamTraneksamat',
  'AsamUrsodeoksikolat',
  'AsamValproat',
  'Asenapine',
  'Asetilkolin',
  'Aspilets',
  'Aspirin',
  'Astaxanthin',
  'Astemizole',
  'Atenolol',
  'Atorvastatin',
  'Atropin',
  'Attapulgite',
  'Avifavir',
  'Avigan',
  'Azathioprine',
  'AzelaicAcid',
  'AzelastinSemprotHidung',
  'AzelastinTetesMata',
  'AzilsartanMedoxomil',
  'Azithromycin',
  'Baby&MeOrganic',
  'Bacitracin',
  'Baclofen',
  'BaloxavirMarboxil',
  'BalsemLang',
  'Barbiturat',
  'Baricitinib',
  'Basiliximab',
  'BebelacGoldSoya',
  'Becom-Zet',
  'Bedaquiline',
  'Benazepril',
  'BenzalkoniumChloride',
  'Benzodiazepine',
  'Benzolac',
  'BenzoylPeroxide',
  'Benzydamine',
  'Bepotastine',
  'Betadine',
  'Betahistine',
  'Betametason',
  'BetametasonTetesMata',
  'BetametasonTetesTelinga',
  'BetametasonTopikal',
  'Betaxolol',
  'Bethanechol',
  'Bevacizumab',
  'Bexarotene',
  'Bezafibrate',
  'Biapenem',
  'Bicalutamide',
  'Bifonazole',
  'Bilberry',
  'BileAcidSequestrant',
  'BimatoprostTetesMata',
  'BimatoprostTopikal',
  'Bioplacenton',
  'Biotin',
  'Bisacodyl',
  'Bisfosfonat',
  'BismuthSubsalicylate',
  'Bisolvon',
  'Bisoprolol',
  'Bleomycin',
  'Bodrex',
  'Bodrexin',
  'Boron',
  'Bortezomib',
  'Botox',
  'Brentuximab',
  'Brexpiprazole',
  'Brinzolamide',
  'Brodalumab',
  'Brolucizumab',
  'Bromelain',
  'Bromhexine',
  'Bromocriptine',
  'Brompheniramine',
  'Bronkodilator',
  'Buavita',
  'Budesonide',
  'Bupivacaine',
  'Buprenorphine',
  'Bupropion',
  'Buscopan',
  'Busulfan',
  'Butabarbital',
  'Butalbital',
  'Butorphanol',
  'CaladineLotion',
  'Calamine',
  'Calcipotriol',
  'Calcitonin',
  'CalcitoninNasalSpray',
  'Calcitriol',
  'CalciumDRedoxon(CDR)',
  'Callusol',
  'Canagliflozin',
  'Canakinumab',
  'Candesartan',
  'Canesten',
  'Capecitabine',
  'Captopril',
  'Carbamazepine',
  'Carbapenem',
  'Carbidopa',
  'Carbimazole',
  'Carboplatin',
  'Cariprazine',
  'Carmellose',
  'Carvedilol',
  'Cataflam',
  'Caviplex',
  'Cefaclor',
  'Cefadroxil',
  'Cefazolin',
  'Cefdinir',
  'Cefditoren',
  'Cefepime',
  'Cefixime',
  'Cefoperazone',
  'Cefoperazone-Sulbactam',
  'Cefotaxim',
  'Cefpirome',
  'Cefpodoxime',
  'Cefprozil',
  'CeftarolineFosamil',
  'Ceftazidime',
  'Ceftizoxime',
  'Ceftriaxone',
  'Cefuroxime',
  'Celecoxib',
  'CendoLyteers',
  'Cephalexin',
  'Cerebrovit',
  'Certolizumab',
  'Cetirizine',
  'Cetrin',
  'Cetuximab',
  'Chlorambucil',
  'Chloramphenicol',
  'ChloramphenicolOphthalmic',
  'ChloramphenicolTetesTelinga',
  'Chlordiazepoxide-Clidinium',
  'Chlorhexidine',
  'Chlorpheniramine',
  'Chlorpromazine',
  'Chlorzoxazone',
  'Cholestyramine',
  'Ciclopirox',
  'Ciclosporin',
  'Cilostazol',
  'Cimetidine',
  'Cinnarizine',
  'Ciprofibrate',
  'Ciprofloxacin',
  'CiprofloxacinTetesMata',
  'CiprofloxacinTetesTelinga',
  'Cisapride',
  'Cisplatin',
  'Citicolin',
  'Clarithromycin',
  'Clebopride',
  'Clenbuterol',
  'Clindamycin',
  'Clobazam',
  'Clobetasol',
  'Clocortolone',
  'Clodronate',
  'Clomifene',
  'Clomipramine',
  'Clonazepam',
  'Clonidine',
  'Clopidogrel',
  'Clotrimazole',
  'ClotrimazoleVaginal',
  'Clozapine',
  'Co-Amoxiclav',
  'Codeine',
  'Codipront',
  'CoenzymeQ10',
  'Colchicine',
  'Colesevelam',
  'Colestipol',
  'Colistin',
  'Combantrin',
  'Combivent',
  'Cortidex',
  'Cortisone',
  'Counterpain',
  'COX-2Inhibitor',
  'CTM',
  'Cyclophosphamide',
  'Cyproheptadine',
  'Cytarabine',
  'Dabigatran',
  'Daclatasvir',
  'Daktarin',
  'Danazol',
  'Dapagliflozin',
  'Dapoxetine',
  'Dapsone',
  'Darifenacin',
  'Darunavir',
  'DaunUngu',
  'Decitabine',
  'Decolgen',
  'Deferasirox',
  'Deferiprone',
  'Deferoxamine',
  'Degirol',
  'Dekongestan',
  'Demacolin',
  'Demeclocycline',
  'Dermatix',
  'Desloratadine',
  'Desmopressin',
  'Desonide',
  'Desoximetasone',
  'Dexaharsen',
  'Dexamethasone',
  'DexamethasoneHarsen/Holi',
  'DexamethasoneOphthalmic',
  'Dexanta',
  'DexchlorpheniramineMaleate',
  'Dexketoprofen',
  'Dexlansoprazole',
  'Dextamine',
  'DexteemPlus',
  'Dextromethorphan',
  'Dextrose',
  'Dexycol',
  'Diazepam',
  'Diclofenac',
  'Diethylcarbamazine',
  'Digoxin',
  'Dihydroartemisinin-Piperaquine',
  'Diltiazem',
  'Dimenhydrinate',
  'Dimethicone',
  'DimethindeneMaleate',
  'Diosmectite',
  'Diosmin',
  'Diphencyprone(DPCP)',
  'Diphenhydramine',
  'Dipyridamole',
  'DiseaseModifyingAntirheumaticDrugs(DMARD)',
  'Disulfiram',
  'Diuretik',
  'DiuretikHematKalium',
  'Dobutamin',
  'Docetaxel',
  'DocosahexaenoicAcid(DHA)',
  'Docusate',
  'Dofetilide',
  'Dolutegravir',
  'Domperidone',
  'Donepezil',
  'Dopamin',
  'Doripenem',
  'DoveSerumSampoPerawatanRambutRontok',
  'Doxazosin',
  'DoxepineTopikal',
  'Doxorubicin',
  'Doxycycline',
  'Doxylamine',
  'Dramamine',
  'Dulaglutide',
  'Dulcolax',
  'Duloxetine',
  'Dumolid',
  'Dydrogesterone',
  'Edoxaban',
  'Efavirenz',
  'Ekspektoran',
  'Elbasvir-Grazoprevir',
  'Eltrombopag',
  'Empagliflozin',
  'Emtricitabine-Tenofovir',
  'Enalapril',
  'EnervonC',
  'Enoxaparin',
  'Entacapone',
  'Entecavir',
  'Entrostop',
  'Enzalutamide',
  'Eperisone',
  'EphedrineTetesHidung',
  'Epinephrine',
  'Epirubicin',
  'Eplerenone',
  'EpoetinAlfa',
  'EpoetinBeta',
  'Eprosartan',
  'Eptifibatide',
  'Erdosteine',
  'Ergotamine',
  'Ertapenem',
  'Erythromycin',
  'Esbriet',
  'Escitalopram',
  'Esmolol',
  'Esomeprazole',
  'Estazolam',
  'Estradiol',
  'EstradiolTopikal',
  'Estriol',
  'Estrogen',
  'Etanercept',
  'Ethambutol',
  'Etodolac',
  'Etoposide',
  'Etoricoxib',
  'Etravirine',
  'Everolimus',
  'Exemestane',
  'Exenatide',
  'Ezetimibe',
  'Famciclovir',
  'Famotidine',
  'Farsifen',
  'Favipiravir',
  'Feburic',
  'Febuxostat',
  'Felodipine',
  'Feminax',
  'FemmyEstrocal',
  'FemmyFyber',
  'Fenilbutazon',
  'Fenofibrate',
  'Fentanyl',
  'Fexofenadine',
  'FGTroches',
  'Fibrat',
  'Fibrinogen',
  'Fibrinolitik',
  'Filgrastim',
  'Finasteride',
  'Fingolimod',
  'Flavoxate',
  'Fluconazole',
  'Fludarabin',
  'Flunarizin',
  'Fluocinolone',
  'Glibenclamide',
  'Gliclazide',
  'Glimepiride',
  'Glipizide',
  'Gliquidone',
  'Gliserol',
  'GliserolTopikal',
  'Glucosamine',
  'Glukagon',
  'Glutathione',
  'Glycopyrronium',
  'Golimumab',
  'Goserelin',
  'Granisetron',
  'Griseofulvin',
  'Guaifenesin',
  'H-Booster',
  'Haloperidol',
  'Halothane',
  'Heparin',
  'Heptaminol',
  'Hesperidin',
  'HolisticareEsterC',
  'Hufabethamin',
  'Hufadexta-M',
  'Hufagripp',
  'HufagrippBPDewasa',
  'HufamagPlus',
  'Hufarizine',
  'Hufavicee',
  'HumanChorionicGonadotropin(HCG)',
  'Hydrochlorothiazide',
  'Hydrocodone',
  'Hydrocortisone',
  'Hydromorphone',
  'Hydroquinone',
  'Hydrotalcite',
  'Hydroxychloroquine',
  'Hydroxyurea',
  'Hydroxyzine',
  'HyoscineButylbromide',
  'HyoscineHydrobromide',
  'Hypromellose',
  'Ibandronate',
  'Ibuprofen',
  'Ifosfamide',
  'Iliadin',
  'Imatinib',
  'Imboost',
  'Imipenem-Cilastatin',
  'Imipramine',
  'Imodium',
  'Inamid',
  'Incidal-OD',
  'Indacaterol',
  'Indapamide',
  'Indinavir',
  'Indomethacin',
  'Indoramin',
  'Infliximab',
  'Insto',
  'InsulinSuntik',
  'Interferon',
  'InterferonAlfa-2a',
  'InterferonAlfa-2b',
  'Interferonalfa-n3',
  'InterferonBeta-1a',
  'InterferonBeta-1b',
  'InterferonGamma-1b',
  'Inza',
  'Ipratropium',
  'Irbesartan',
  'Irinotecan',
  'Isocarboxazid',
  'Isoniazid',
  'IsosorbidMononitrat',
  'IsosorbideDinitrate',
  'Isothipendyl',
  'Isotretinoin',
  'IsotretinoinOral',
  'Isoxsuprine',
  'Isradipine',
  'Itraconazole',
  'Ivabradine',
  'Ivermectin',
  'IVIG',
  'JanumetXR',
  'Kafein',
  'Kalium',
  'Kalpanax',
  'Kalsium',
  'KalsiumAsetat',
  'KalsiumGlukonat',
  'KalsiumKarbonat',
  'Kanamycin',
  'KarbonAktif',
  'KBSuntik',
  'KBSuntik1Bulan',
  'KBSuntik3Bulan',
  'Kenacort',
  'KenaloginOrabase',
  'Ketamine',
  'Ketoconazole',
  'Ketoprofen',
  'Ketorolac',
  'Ketotifen',
  'Kina',
  'Kiranti',
  'Klorokuin',
  'Kolin',
  'Komix',
  'Konidin',
  'Kortikosteroid',
  'Kotrimoksazol',
  'L-Alanyl-L-Glutamine',
  'Labetalol',
  'LactacydBaby',
  'Lacto-B',
  'Lactobacillusacidophilus',
  'Lactobacillusreuteri',
  'Lactobacillusrhamnosus',
  'Laktulosa',
  'Lamivudine',
  'Lamotrigine',
  'Lancid',
  'Lanolin',
  'Lansoprazole',
  'Lapatinib',
  'Latanoprost',
  'Leflunomide',
  'Lenalidomide',
  'Letrozole',
  'Leucovorin',
  'Levamisole',
  'Levetiracetam',
  'Levocetirizine',
  'Levodopa',
  'Levodropropizine',
  'Levofloxacin',
  'LevonorgestrelKontrasepsiDarurat',
  'Levopar',
  'Levothyroxine',
  'Lidocaine',
  'Linagliptin',
  'Lincomycin',
  'Linezolid',
  'Liothyronine',
  'Lipitor',
  'Liraglutide',
  'Lisinopril',
  'Lithium',
  'Lixisenatide',
  'Loperamide',
  'LopinavirRitonavir',
  'Loratadine',
  'Lorazepam',
  'Losartan',
  'Lovastatin',
  'Lutein',
  'Lynestrenol',
  'LysinedanAsamAminoEsensialOral',
  'Maaggel',
  'Macrogol',
  'Magaldrate',
  'MagnesiumHidroksida',
  'MagnesiumSitrat',
  'MagnesiumSulfat(MgSO4)',
  'Makrolid',
  'Manitol',
  'MAOI',
  'Maprotiline',
  'Mebendazole',
  'Mebeverine',
  'Mebhydrolin',
  'Medi-Klin',
  'Mefinal',
  'Melanox',
  'Melatonin',
  'Meloxicam',
  'Melphalan',
  'Memantine',
  'MeniranHijau',
  'Mephobarbital',
  'Meropenem',
  'Mertigo',
  'Mesalazine',
  'Mesterolone',
  'Metamfetamin',
  'Metamizole',
  'Metformin',
  'Methadone',
  'Methimazole',
  'Methisoprinol',
  'Methohexital',
  'Methotrexate',
  'Methoxsalen',
  'Methylcellulose',
  'Methylcobalamin',
  'Methylergometrine',
  'Methylphenidate',
  'Methylprednisolone',
  'MetilSalisilat',
  'Metildopa',
  'Metoclopramide',
  'Metoprolol',
  'Metronidazole',
  'MetronidazoleOvula',
  'Micafungin',
  'Miconazole',
  'Microgest',
  'Microgynon',
  'Microlax',
  'Midazolam',
  'MigranKonimex',
  'Minocycline',
  'Minoxidil',
  'MinyakIkan',
  'Mirtazapine',
  'Misoprostol',
  'Mivacurium',
  'Mixagrip',
  'Mixalgin',
  'Modafinil',
  'Moexipril',
  'Molnupiravir',
  'MometasoneFuroate',
  'Montelukast',
  'Monuril',
  'Morfin',
  'Moxifloxacin',
  'Mupirocin',
  'MuscleRelaxant',
  'MycophenolateMofetil',
  'MycophenolateSodium',
  'Mycoral',
  'Mylanta',
  'Nabumetone',
  'Nadolol',
  'Nadroparin',
  'NaftidrofurylOxalate',
  'Naftifine',
  'Nalbuphine',
  'Nalgestan',
  'Naloxone',
  'Naphazoline',
  'Naproxen',
  'Natamycin',
  'NatriumBikarbonat',
  'NatriumFosfat',
  'NatriumKlorida(NaCl)',
  'NatriumPicosulfat',
  'NatriumTiosulfat',
  'Natur-E',
  'Nebivolol',
  'NeoRheumacyl',
  'NeocateJunior',
  'Neomycin',
  'Neostigmine',
  'NeozepForte',
  'Neuralgin',
  'Neurobion',
  'Neurodex',
  'Nevirapine',
  'NewDiatabs',
  'Nicardipine',
  'Nicotinamide',
  'Nifedipine',
  'Nifuroxazide',
  'Nilotinib',
  'Nimetazepam',
  'Nimodipine',
  'Nintedanib',
  'Nitisinone',
  'Nitrat',
  'Nitrofurantoin',
  'NitrogenOksida',
  'Nitrogliserin',
  'Nizatidine',
  'NonsteroidalAnti-inflammatoryDrugs(NSAID)',
  'Norepinephrine',
  'Norethisterone',
  'Norfloxacin',
  'Norit',
  'Noscapine',
  'Nusinersen',
  'NutribabyRoyal1',
  'NutribabyRoyal2',
  'NutrilonRoyalProsyneo',
  'NUVOHandSanitizerdanHandSoap',
  'Nystatin',
  'ObatAntihipertensi',
  'ObatAntivirus',
  'ObatCacing',
  'ObatDigestan',
  'ObatGolonganTetracycline',
  'ObatImunosupresan',
  'ObatPencahar',
  'Octreotide',
  'Ofloxacin',
  'OfloxacinTetesMata',
  'OfloxacinTetesTelinga',
  'Oksitosin',
  'Olanzapine',
  'Olmesartan',
  'Olodaterol',
  'Olopatadine',
  'Omalizumab',
  'Omeprazole',
  'Ondansetron',
  'Opioid',
  'Opox',
  'Oralit',
  'Orlistat',
  'Oseltamivir',
  'Oskadon',
  'Oxacillin',
  'Oxaliplatin',
  'Oxcarbazepine',
  'Oxomemazine',
  'OXY',
  'Oxycodone',
  'Oxymetazoline',
  'Oxytetracycline',
  'Paclitaxel',
  'Paliperidone',
  'Palonosetron',
  'Panadol',
  'Pancuronium',
  'Pantoprazole',
  'Papaverine',
  'Paracetamol(Acetaminophen)',
  'Paraldehyde',
  'Paramex',
  'ParamolForte',
  'Parasol',
  'Parecoxib',
  'Paricalcitol',
  'Parnaparin',
  'Paromomycin',
  'Paxlovid',
  'Peditox',
  'Pegaspargase',
  'Pegfilgrastim',
  'Peginterferonalfa-2a',
  'PeginterferonAlfa-2b',
  'Pektin',
  'Penciclovir',
  'PenghambatAdrenergik',
  'PenghambatAlfa',
  'PenghambatBeta',
  'PenghambatPompaProton',
  'PenghambatProteinKinase',
  'PenicillinGProcaine',
  'PenicillinVK',
  'Penisilin',
  'Pentobarbital',
  'Pentoxifylline',
  'Perampanel',
  'Perindopril',
  'Permethrin',
  'Perphenazine',
  'Petrolatum',
  'Phenazopyridine',
  'Phenelzine',
  'Phenobarbital',
  'Phenothiazine',
  'Phenylephrine',
  'Phenylpropanolamine',
  'Phenytoin',
  'PilKB',
  'Pilocarpine',
  'Pimecrolimus',
  'Pimozide',
  'Pioglitazone',
  'Piperazine',
  'Piracetam',
  'PirantelPamoat',
  'Pirfenidone',
  'Pirocam',
  'Piroxicam',
  'Pitavastatin',
  'Policresulen',
  'Polycarbophil',
  'PolymyxinBOphthalmic',
  'PolymyxinBTetesTelinga',
  'PolymyxinBTopikal',
  'Polysilane',
  'Pomalidomide',
  'Ponstan',
  'Postinor',
  'PovidoneIodine',
  'Pramipexole',
  'Prasugrel',
  'Pravastatin',
  'Praziquantel',
  'Prazosin',
  'Prednisolone',
  'Prednison',
  'Pregabalin',
  'PrilocaineTopikal',
  'Primaquine',
  'Primidone',
  'PrimolutN',
  'Probenecid',
  'Probiotik',
  'Procainamide',
  'ProcaterolHClInhalasi',
  'ProcaterolHClOral',
  'Prochlorperazine',
  'Procold',
  'Progesteron',
  'Promag',
  'Promethazine',
  'Propafenone',
  'Propofol',
  'Propranolol',
  'Propylthiouracil',
  'Proris',
  'Pseudoephedrine',
  'Psyllium',
  'PUREGROWOrganic',
  'Pyrazinamide',
  'Pyridostigmine',
  'Pyridoxine',
  'Pyrimethamine',
  'Quetiapine',
  'Quinapril',
  'Quinidine',
  'Quinolone',
  'Rabeprazole',
  'Racecadotril',
  'Radium',
  'Raloxifen',
  'Ramipril',
  'Ranitidin',
  'Ranolazine',
  'Rebamipide',
  'Redoxon',
  'Regorafenib',
  'Remdesivir',
  'Remifentanil',
  'Repaglinide',
  'Reserpine',
  'Retinoid',
  'Rhemafar',
  'Rhinofed',
  'RhinosSR',
  'Rho',
  'Ribavirin',
  'Riboflavin',
  'Rifampicin',
  'Rilpivirine',
  'Riluzole',
  'Risedronate',
  'Risperidone',
  'Rituximab',
  'Rivaroxaban',
  'Rivastigmine',
  'Rocuronium',
  'RohtoEyeCare',
  'Ropinirole',
  'Rosuvastatin',
  'Roxithromycin',
  'Rufinamide',
  'Saccharomyces',
  'SakatonikLiver',
  'Salbutamol',
  'Salmeterol',
  'Salonpas',
  'Sangobion',
  'SangobionFemine',
  'Sanmol',
  'Saxagliptin',
  'Scantoma',
  'Scopolamine',
  'Scott’sEmulsion',
  'Secobarbital',
  'Secukinumab',
  'Sefalosporin',
  'SelectiveSerotoninReuptakeInhibitors(SSRIs)',
  'Selegiline',
  'Selenium',
  'SeleniumSulfide',
  'Semaglutide',
  'Senna',
  'Sertraline',
  'Sevelamer',
  'SGMEksplorSoyaPro-gressMaxxdenganIronC',
  'Sildenafil',
  'Silodosin',
  'SilverSulfadiazine',
  'Simeprevir',
  'Simethicone',
  'Simvastatin',
  'Sirolimus',
  'Sitagliptin',
  'SodiumDivalproex',
  'Sofosbuvir',
  'Somatropin',
  'Sorafenib',
  'Sotalol',
  'Sparfloxacin',
  'Spiramycin',
  'Spironolactone',
  'Squalene',
  'Statin',
  'Stavudine',
  'Stevia',
  'StimunoAnak',
  'StimunoForte',
  'StopCold',
  'Strepsils',
  'Streptokinase',
  'Streptomycin',
  'Strontium',
  'Sufentanil',
  'Sukralfat',
  'Sulfacetamide',
  'Sulfadiazine',
  'Sulfamethizole',
  'Sulfamethoxazole',
  'Sulfanilamide',
  'Sulfasalazine',
  'Sulfonamida',
  'Sulfonilurea',
  'Sulfur',
  'Sulpiride',
  'Sultamicillin',
  'Sumagesic',
  'Sumatriptan',
  'Sunitinib',
  'SuperTetra',
  'Suxamethonium',
  'Tacrine',
  'Tacrolimus',
  'Tadalafil',
  'Tamoxifen',
  'Tamsulosin',
  'Tapentadol',
  'Telbivudine',
  'Telmisartan',
  'TelonLang',
  'Temazepam',
  'Tembaga',
  'Temozolomide',
  'Tempra',
  'Tenecteplase',
  'TenofovirAlafenamide',
  'Teofilin',
  'TerapiPenggantianHormon',
  'Terazosin',
  'Terbinafine',
  'Terbutaline',
  'Terfenadine',
  'Termorex',
  'Terramycin',
  'Testosterone',
  'TetracyclineHcl',
  'TetracyclineTopikal',
  'Thalidomide',
  'Thiamphenicol',
  'Thiamycin',
  'Thioguanine',
  'Thiopental',
  'Thrombophob',
  'Tiabendazole',
  'Ticagrelor',
  'Ticlopidine',
  'Tigecycline',
  'Timolol',
  'Tioconazole',
  'Tiotropium',
  'Tirofiban',
  'Tizanidine',
  'Tobramycin',
  'Tocilizumab',
  'TolakAnginCair',
  'Tolnaftate',
  'Tolterodine',
  'TonikumBayer',
  'Topiramate',
  'Torasemide',
  'Tramadol',
  'Tramadol-Paracetamol',
  'Trandolapril',
  'Transpulmin',
  'Tranylcypromine',
  'Tremenza',
  'TretinoinOral',
  'TretinoinTopikal',
  'Triamcinolone',
  'TriamcinoloneSemprotHidung',
  'Triclabendazole',
  'Triclosan',
  'Trifluoperazine',
  'Triflusal',
  'Trihexyphenidyl',
  'Trimetazidine',
  'Trimethoprim',
  'Triprolidine',
  'Tripsin',
  'Ulipristal',
  'Ultraflu',
  'UreaTopikal',
  'VaksinAstraZeneca',
  'VaksinBCG',
  'VaksinCampak',
  'VaksinCansino',
  'VaksinDPT',
  'VaksinHepatitisB',
  'VaksinHPV',
  'VaksinInfluenza',
  'VaksinJohnson&Johnson',
  'VaksinModerna',
  'VaksinMR',
  'VaksinNovavax',
  'VaksinPfizer',
  'VaksinPolio',
  'VaksinRabies',
  'VaksinRotavirus',
  'VaksinSinopharm',
  'VaksinSinovac',
  'VaksinSputnik',
  'VaksinTifoid',
  'Valacyclovir',
  'Valganciclovir',
  'Valsartan',
  'Vancomycin',
  'Vardenafil',
  'VarianProdukSGMEksplorPro-gressMaxxdenganIronC',
  'Vasodilator',
  'Vasopressin',
  'Vectrine',
  'Vecuronium',
  'Velpatasvir-Sofosbuvir',
  'Venlafaxine',
  'Verapamil',
  'Verile',
  'Viagra',
  'VidoranXmart',
  'Vinblastin',
  'Vincristine',
  'Vinorelbine',
  'Vitacid',
  'Vitacimin',
  'VitaminA',
  'VitaminB1',
  'VitaminB12',
  'VitaminB2',
  'VitaminB3(Niacin)',
  'VitaminB5',
  'VitaminB6',
  'VitaminB9(AsamFolat)',
  'VitaminC',
  'VitaminD',
  'VitaminD3',
  'VitaminE',
  'VitaminK',
  'Voltadex',
  'Voltaren',
  'Voriconazole',
  'Vortioxetine',
  'Warfarin',
  'WheatDextrin',
  'Xanax',
  'Xalatan',
  'Xalifin',
  'Xamthone',
  'Xatral',
  'Xeloda',
  'Xenical',
  'Xibornol',
  'Xylometazoline',
  'Zafirlukast',
  'Zalcitabine',
  'Zaleplon',
  'Zanamivir',
  'Zanolimumab',
  'Zidovudine',
  'Zileuton',
  'Zinc',
  'ZincOksida',
  'ZincPikolinat',
  'Ziprasidone',
  'ZoledronicAcid',
  'Zolmitriptan',
  'Zolpidem',
  'Zonisamide',
  'Zopiclone',
  'Zotepine',
  'Zotarolimus',
  'Zuclopenthixol',
];

const assessments = [
  'K00.0 Anodontia',
  'K00.1 Supernumerary teeth',
  'K00.2 Abnormalities of size and form of teeth',
  'K00.3 Mottled teeth',
  'K00.4 Disturbances in tooth formation',
  'K00.5 Hereditary disturbances in tooth structure, not elsewhere classified',
  'K00.6 Disturbances in tooth eruption',
  'K00.7 Teething syndrome',
  'K00.8 Other disorders of tooth development',
  'K00.9 Disorder of tooth development, unspecified',
  'K01.0 Embedded teeth',
  'K01.1 Impacted teeth',
  'K02.0 Caries limited to enamel',
  'K02.1 Caries of dentine',
  'K02.2 Caries of cementum',
  'K02.3 Arrested dental caries',
  'K02.4 Odontoclasia',
  'K02.5 Caries with pulp exposure',
  'K02.8 Other dental caries',
  'K02.9 Dental caries, unspecified',
  'K03.0 Excessive attrition of teeth',
  'K03.1 Abrasion of teeth',
  'K03.2 Erosion of teeth',
  'K03.3 Pathological resorption of teeth',
  'K03.4 Hypercementosis',
  'K03.5 Ankylosis of teeth',
  'K03.6 Deposits [accretions] on teeth',
  'K03.7 Posteruptive colour changes of dental hard tissues',
  'K03.8 Other specified diseases of hard tissues of teeth',
  'K03.9 Disease of hard tissues of teeth, unspecified',
  'K04.0 Pulpitis',
  'K04.1 Necrosis of pulp',
  'K04.2 Pulp degeneration',
  'K04.3 Abnormal hard tissue formation in pulp',
  'K04.4 Acute apical periodontitis of pulpal origin',
  'K04.5 Chronic apical periodontitis',
  'K04.6 Periapical abscess with sinus',
  'K04.7 Periapical abscess without sinus',
  'K04.8 Radicular cyst',
  'K04.9 Other and unspecified diseases of pulp and periapical tissues',
  'K05.0 Acute gingivitis',
  'K05.1 Chronic gingivitis',
  'K05.2 Acute periodontitis',
  'K05.3 Chronic periodontitis',
  'K05.4 Periodontosis',
  'K05.5 Other periodontal diseases',
  'K05.6 Periodontal disease, unspecified',
  'K06.0 Gingival recession',
  'K06.1 Gingival enlargement',
  'K06.2 Gingival and edentulous alveolar ridge lesions associated with trauma',
  'K06.8 Other specified disorders of gingiva and edentulous alveolar ridge',
  'K06.9 Disorder of gingiva and edentulous alveolar ridge, unspecified',
  'K07.0 Major anomalies of jaw size',
  'K07.1 Anomalies of jaw-cranial base relationship',
  'K07.2 Anomalies of dental arch relationship',
  'K07.3 Anomalies of tooth position',
  'K07.4 Malocclusion, unspecified',
  'K07.5 Dentofacial functional abnormalities',
  'K07.6 Temporomandibular joint disorders',
  'K07.8 Other dentofacial anomalies',
  'K07.9 Dentofacial anomaly, unspecified',
  'K08.0 Exfoliation of teeth due to systemic causes',
  'K08.1 Loss of teeth due to accident, extraction or local periodontal disease',
  'K08.2 Atrophy of edentulous alveolar ridge',
  'K08.3 Retained dental root',
  'K08.8 Other specified disorders of teeth and supporting structures',
  'K08.9 Disorder of teeth and supporting structures, unspecified',
  'K09.0 Developmental odontogenic cysts',
  'K09.1 Developmental (nonodontogenic) cysts of oral region',
  'K09.2 Other cysts of jaw',
  'K09.8 Other cysts of oral region, not elsewhere classified',
  'K09.9 Cyst of oral region, unspecified',
  'K10.0 Developmental disorders of jaws',
  'K10.1 Giant cell granuloma, central',
  'K10.2 Inflammatory conditions of jaws',
  'K10.3 Alveolitis of jaws',
  'K10.8 Other specified diseases of jaws',
  'K10.9 Disease of jaws, unspecified',
  'K11.0 Atrophy of salivary gland',
  'K11.1 Hypertrophy of salivary gland',
  'K11.2 Sialoadenitis',
  'K11.3 Abscess of salivary gland',
  'K11.4 Fistula of salivary gland',
  'K11.5 Sialolithiasis',
  'K11.6 Mucocele of salivary gland',
  'K11.7 Disturbances of salivary secretion',
  'K11.8 Other diseases of salivary glands',
  'K11.9 Disease of salivary gland, unspecified',
  'K12.0 Recurrent oral aphthae',
  'K12.1 Other forms of stomatitis',
  'K12.2 Cellulitis and abscess of mouth',
  'K12.3 Oral mucositis (ulcerative)',
  'K13.0 Diseases of lips',
  'K13.1 Cheek and lip biting',
  'K13.2 Leukoplakia and other disturbances of oral epithelium, including tongue',
  'K13.3 Hairy leukoplakia',
  'K13.4 Granuloma and granuloma-like lesions of oral mucosa',
  'K13.5 Oral submucous fibrosis',
  'K13.6 Irritative hyperplasia of oral mucosa',
  'K13.7 Other and unspecified lesions of oral mucosa',
  'K14.0 Glossitis',
  'K14.1 Geographic tongue',
  'K14.2 Median rhomboid glossitis',
  'K14.3 Hypertrophy of tongue papillae',
  'K14.4 Atrophy of tongue papillae',
  'K14.5 Plicated tongue',
  'K14.6 Glossodynia',
  'K14.8 Other diseases of tongue',
  'K14.9 Disease of tongue, unspecified',
];

const teethPositions = [
  'Lidah',
  'Posisi Gigi 11',
  'Posisi Gigi 12',
  'Posisi Gigi 13',
  'Posisi Gigi 14',
  'Posisi Gigi 15',
  'Posisi Gigi 16',
  'Posisi Gigi 17',
  'Posisi Gigi 18',
  'Posisi Gigi 21',
  'Posisi Gigi 22',
  'Posisi Gigi 23',
  'Posisi Gigi 24',
  'Posisi Gigi 25',
  'Posisi Gigi 26',
  'Posisi Gigi 27',
  'Posisi Gigi 28',
  'Posisi Gigi 31',
  'Posisi Gigi 32',
  'Posisi Gigi 33',
  'Posisi Gigi 34',
  'Posisi Gigi 35',
  'Posisi Gigi 36',
  'Posisi Gigi 37',
  'Posisi Gigi 38',
  'Posisi Gigi 41',
  'Posisi Gigi 42',
  'Posisi Gigi 43',
  'Posisi Gigi 44',
  'Posisi Gigi 45',
  'Posisi Gigi 46',
  'Posisi Gigi 47',
  'Posisi Gigi 48',
  'Posisi Gigi 51',
  'Posisi Gigi 52',
  'Posisi Gigi 53',
  'Posisi Gigi 54',
  'Posisi Gigi 55',
  'Posisi Gigi 61',
  'Posisi Gigi 62',
  'Posisi Gigi 63',
  'Posisi Gigi 64',
  'Posisi Gigi 65',
  'Posisi Gigi 71',
  'Posisi Gigi 72',
  'Posisi Gigi 73',
  'Posisi Gigi 74',
  'Posisi Gigi 75',
  'Posisi Gigi 81',
  'Posisi Gigi 82',
  'Posisi Gigi 83',
  'Posisi Gigi 84',
  'Posisi Gigi 85',
  'Rahang Atas',
  'Rahang Bawah',
  'Rongga Pipi Kanan',
  'Rongga Pipi Kiri',
];

export const SUCCESS_MESSAGES = {
  CREATE_ENTITY: (entity: string) => `${entity} created successfully`,
  UPDATE_ENTITY: (entity: string, id: string | number) =>
    `${entity} with id ${id} updated successfully`,
  DELETE_ENTITY: (entity: string, id: string | number) =>
    `${entity} with id ${id} deactivated successfully`,
  UPLOAD_FILES: (uuid: string) => `Successfully upload files for user ${uuid}`,
  REACTIVATE_ENTITY: (entity: string, id: string | number) =>
    `Successfully reactivated ${entity} with id ${id}`,
  MODIFY_DOCTOR_BACKGROUND: (
    background: 'academics' | 'experiences' | 'certifications' | 'achievements',
    doctor_id: string
  ) => `Successfully modify ${background} for doctor ${doctor_id}`,
  MODIFY_DOCTOR_SERVICE: (
    doctor_id: string,
    service: 'schedules' | 'treatments'
  ) => `Successfully modify ${service} for doctor ${doctor_id}`,
};

export const ERROR_MESSAGES = {
  CREATE_ENTITY: (entity: string) => `Failed to create ${entity}`,
  UPDATE_ENTITY: (entity: string, id: string | number) =>
    `Failed to update ${entity} with id ${id}`,
  NOT_FOUND: (entity: string, id: string | number) =>
    `${entity} with id ${id} not found`,
  DUPLICATE: {
    PHONE: 'Phone number already exists',
    USERNAME: 'Username already exists',
    EMAIL: 'Email already exists',
    NIK: 'NIK already exists',
  },
  ALREADY_DELETED: (entity: string) => `${entity} has already been deleted`,
  ALREADY_ACTIVE: (entity: string, id: string | number) =>
    `${entity} with id ${id} is already active`,
  DELETE_ENTITY: (entity: string, id: string | number) =>
    `Failed to delete ${entity} with id ${id}`,
  REACTIVATE_ENTITY: (entity: string, id: string | number) =>
    `Failed to reactivate ${entity} with id ${id}`,
  CHANGE_PASSWORD: 'Failed to change password',
  UPLOAD_FILE: 'Failed to upload files',
  FORBIDDEN: 'You are not authorized to perform this action',
  WRONG_PASSWORD: 'Wrong password',
  MODIFY_DOCTOR_BACKGROUND: (
    background: 'academics' | 'experiences' | 'certifications' | 'achievements',
    doctor_id: string
  ) => `Failed to update ${background} for doctor with id ${doctor_id}`,
  MODITY_DOCTOR_SERVICES: (
    doctor_id: string,
    service: 'schedules' | 'treatments'
  ) => `Failed to update ${service} for doctor with id ${doctor_id}`,
  INVALID_TIME: (format: string) => `time format should be ${format}`,
  INVALID_LOGIN: 'Invalid username or password',
  ACCOUNT_DEACTIVATED: 'Your account has been deactivated',
};

export const CONSTRAINT_NAME = {
  PATIENT: {
    EMAIL: 'unique_user_email',
    PHONE: 'users_phone_key',
    NIK: 'users_nik_key',
  },
  ADMIN: {
    USERNAME: 'admins_username_key',
    EMAIL: 'admins_email_key',
  },
  DOCTOR: {
    USERNAME: 'doctors_username_key',
    EMAIL: 'doctors_email_key',
    PHONE: 'doctors_phone_key',
    NIK: 'doctors_nik_key',
  },
};

export const JWT_SECRET_MAPPING: { [key in JwtName]: string } = {
  adminJWT: env.ADMIN_JWT_SECRET,
  userJWT: env.USER_JWT_SECRET,
  doctorJWT: env.DOCTOR_JWT_SECRET,
};
