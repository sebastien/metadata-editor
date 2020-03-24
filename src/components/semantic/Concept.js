import React, { useState, useEffect } from 'react'
import Editor from '../Editor'
import { SKOS, RDFS, STORE } from '../../model/semantic'

// TODO: We could capture the project/unproject as part of the schema as well.
/* We define a configuration for the structure editor, which makes it
 * possible to reuse the same editor for metadata attributes and semantic
 * elements.
 */
const schema = {
  label: { label: 'Label', type: 'label', mode: 'edit' },
  definition: { label: 'Definition', type: 'text', mode: 'edit' },
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

/**
 * Projects the concept object model to an editable structure.
 */
const project = concept => concept ? {
  id: concept.id,
  label: concept.label || '',
  definition: concept.definition || '',
  attributes: concept.attributes.map(_ => _.toJSON()),
  relations: concept.relations.map(_ => _.toJSON())
} : {}

/**
 * Unprojects the edited structure into the concept object model, overriding
 * the concept's previous state. This is a mutating operation.
 */
const unproject = (concept, data) => {
  if (!concept) {
    return false
  }
  // TODO: We should wrap it as it has implications
  concept.id = data.id
  concept.setLabel(data.label)
  concept.setDefinition(data.definition)
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
  return concept
}

export default function Concept (props) {
  const concept = props.concept ? STORE.ensureConcept(props.concept) : null
  const [value, setValue] = useState({})
  useEffect(() => {
    setValue(project(concept))
  }, [concept])

  const onChange = data => {
    setValue(project(unproject(concept, data)))
  }

  return (
    <div className='Concept'>
      <Editor schema={schema} onChange={onChange} defaultValue={value} />
    </div>
  )
}
