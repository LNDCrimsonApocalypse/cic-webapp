// Canonical list of UMak Offices / Colleges / Institutes used by request forms.
// Rendered as a grouped <optgroup> select. Values are the full names so they
// read well in admin dashboards and submissions exports.

export const OFFICES_AND_CENTERS: readonly string[] = [
  'Office of the President (OP)',
  'Office of the University Registrar (OUR)',
  'Center for Information Technology (CIT)',
  'Center for Admission and Scholarships (CAS)',
  'Center for Technology Incubation and Enterprise Development (CTIED)',
  'Office of the Vice President for Academic Affairs (OVPAA)',
  'Center for International and Global Affairs (CIGA)',
  'Center for Technology-Based Learning (TBL) Hub (CTBL)',
  'Office of the Vice President for Administration (OVPA)',
  'Human Resource Management Office (HRMO)',
  'General Services Office (GSO)',
  'Medical and Dental Clinic',
  'Occupational Health and Safety Office (OHSO)',
  'University Facilities Management Office (UFMO)',
  'Supply and Property Management Office (SPMO)',
  'Office of the Vice President For Finance (OVPF)',
  'Accounting Office (AO)',
  'Budget Management Office (BMO)',
  'Cash Office (CO)',
  'Office of The Vice President for Planning and Research (OVPPR)',
  'Center for Quality Management and Development (CQMD)',
  'Center for University Research (CUR)',
  'Center for Planning and Development (CPD)',
  'Library Learning Commons (LLC)',
  'Office of the Vice President for Student Services and Community Development (OVPSSCD)',
  'Center for Athletic Development (CAD)',
  'Center for Culture and the Arts (CCA)',
  'Center for Student Formation & Discipline (CSFD)',
  'Center for Community Extension and Development (CCED)',
  'Our Lady Seat of Wisdom Chapel',
  'Center for Student Organization and Activities (CSOA)',
  'Center for Guidance Services (Guidance)',
  'Center for Inclusive Education, Gender and Development (CIEGAD)',
  'Office of the University Secretary (OUSEC)',
  'Center for Linkages and Placement (CLP)',
  'Center for Integrated Communications (CIC)',
  'Center for Data Protection and Records Management (CDPRM)',
  'Center for Alumni Affairs (CAA)',
  'Innovation and Technology Support Office (ITSO)',
]

export const COLLEGES_AND_INSTITUTES: readonly string[] = [
  'College of Business and Financial Science (CBFS)',
  'College of Construction Sciences and Engineering (CCSE)',
  'College of Computing and Information Sciences (CCIS)',
  'College of Continuing, Advanced and Professional Studies (CCAPS)',
  'College of Governance and Public Policy (CGPP)',
  'College of Human Kinetics (CHK)',
  'College of Innovative Teacher Education (CITE)',
  'Higher School ng UMak (HSU)',
  'College of Liberal Arts and Sciences (CLAS)',
  'College of Engineering Technology (CET)',
  'College of Tourism and Hospitality Management (CTHM)',
  'School of Law (SOL)',
  'Institute of Accountancy (IOA)',
  'Institute of Imaging Health Science (IIHS)',
  'Institute of Arts and Designs (IAD)',
  'Institute of Nursing (ION)',
  'Institute of Pharmacy (IOP)',
  'Institute for Social Development and Nation Building (ISDNB)',
  'Institute for Technical Education and Skills Training (ITEST)',
  'Institute of Psychology (IOPsy)',
]

export interface OfficeOptionGroup {
  label: string
  options: readonly string[]
}

export const OFFICE_GROUPS: OfficeOptionGroup[] = [
  { label: 'Offices and Centers', options: OFFICES_AND_CENTERS },
  { label: 'Colleges/Institutes', options: COLLEGES_AND_INSTITUTES },
]

export const ALL_OFFICES: string[] = [
  ...OFFICES_AND_CENTERS,
  ...COLLEGES_AND_INSTITUTES,
]
