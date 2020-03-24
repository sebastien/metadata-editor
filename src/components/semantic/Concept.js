import React, { useState } from 'react'
import Editor from '../Editor'
import { SKOS, RDFS, STORE } from '../../model/semantic'

/* We define a configuration for the structure editor, which makes it
 * possible to reuse the same editor for metadata attributes and semantic
 * elements.
 */
const schema = {
  label: { label: 'Label', type: 'label', mode: 'edit' },
  description: { label: 'Description', type: 'text', mode: 'edit' },
  attributes: {
    label: 'Attributes',
    type: 'list',
    style: 'grid',
    content: {
      type: 'composite',
      layout: 'horizontal',
      fields: {
        relation: {
          type: 'element',
          mode: 'edit',
          options: SKOS.getTerms().concat(RDFS.getTerms()),
          placeholder: 'name'
        },
        equals: {
          type: 'separator',
          label: '='
        },
        object: {
          type: 'label',
          mode: 'edit',
          placeholder: 'value'
        },
        as: {
          type: 'separator',
          label: 'as'
        },
        value: {
          type: 'label',
          mode: 'edit',
          placeholder: 'variant'
        }
      }
    }
  },
  relations: {
    label: 'Relations',
    type: 'list',
    style: 'grid',
    content: {
      type: 'composite',
      layout: 'horizontal',
      fields: {
        relation: {
          type: 'element',
          mode: 'edit',
          options: SKOS.getTerms().concat(RDFS.getTerms()),
          placeholder: 'name'
        },
        equals: {
          type: 'separator',
          label: 'with'
        },
        object: {
          type: 'label',
          mode: 'edit',
          placeholder: 'value'
        },
        as: {
          type: 'separator',
          label: ':'
        },
        value: {
          type: 'label',
          mode: 'edit',
          placeholder: 'variant'
        }
      }
    }
  }
}

export default function Concept (props) {
  const concept = props.concept ? STORE.ensureConcept(props.concept) : null
  const [value, setValue] = useState(concept ? concept.toJSON() : {})

  const onChange = data => {
    if (!concept) {
      return false
    }
    concept.setLabel(data.label)
    concept.setDefinition(data.description)
    // We just reset the attributes
    concept.clearAttributes();
    (data.attributes || []).forEach((_, i) => {
      const { relation, value, qualifier } = _ || {}
      concept.addAttribute(relation, value, qualifier)
    })
    concept.clearRelations();
    (data.relations || []).forEach((_, i) => {
      const { relation, value, qualifier } = _ || {}
      concept.addRelation(relation, value, qualifier)
    })
    setValue(concept.toJSON())
  }

  window.CONCEPT = concept
  return (
    <div className='Concept'>
      <Editor schema={schema} onChange={onChange} defaultValue={value} />
    </div>
  )
}
