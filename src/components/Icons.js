import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCat, faTable, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
const Icons = {
  Dataset: <span className='Icon'><FontAwesomeIcon icon={faTable} /></span>,
  Collection: <span className='Icon'><FontAwesomeIcon icon={faLayerGroup} /></span>,
  DatCat: <span className='Icon'><FontAwesomeIcon icon={faCat} /></span>
}
export default Icons
