import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat, faTable, faLayerGroup, faCircle, faTimesCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
const Icons = {
  Dataset: <span className='Icon'><FontAwesomeIcon icon={faTable} /></span>,
  Collection: <span className='Icon'><FontAwesomeIcon icon={faLayerGroup} /></span>,
  DatCat: <span className='Icon'><FontAwesomeIcon icon={faCat} /></span>,
  Field: <span className='Icon'><FontAwesomeIcon icon={faCircle} /></span>,
  Remove: <span className='Icon'><FontAwesomeIcon icon={faTimesCircle} /></span>,
  Search: <span className='Icon'><FontAwesomeIcon icon={faSearch} /></span>
}
export default Icons
