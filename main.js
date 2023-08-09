const topics = {
    title: 'Topics',
    items: [{
      title: 'Nature',
      items: [{
        title: 'Earth',
        items: [{
          title: 'Physical geography',
          items: [{
            title: 'Rivers',
            items: []
          }, {
            title: 'Tectonics',
            items: []
          }, {
            title: 'Mountains',
            items: []
          }, {
            title: 'Erosion',
            items: []
          }, {
            title: 'Glaciers',
            items: []
          }, {
            title: 'Fjords',
            items: []
          }, {
            title: 'Climate',
            items: []
          }]
        }, {
          title: 'Biology',
          items: [{
            title: 'Evolution',
            items: []
          }, {
            title: 'Humans',
            items: []
          }, {
            title: 'Whales',
            items: []
          }, {
            title: 'Trees',
            items: []
          }]
        }]
      }, {
        title: 'Space',
        items: [{
          title: 'Nebulae',
          items: [{
            title: 'Orion Nebula',
            items: []
          }, {
            title: 'Horsehead Nebula',
            items: []
          }, {
            title: 'North America Nebula',
            items: []
          }]
        }, {
          title: 'Galaxies',
          items: [{
            title: 'Milky Way Galaxy',
            items: []
          }, {
            title: 'Andromeda Galaxy',
            items: []
          }, {
            title: 'Blackeye Galaxy',
            items: []
          }]
        }]
      }, {
        title: 'Physics',
        items: [{
          title: 'Entropy',
          items: []
        }, {
          title: 'Gravity',
          items: []
        }, {
          title: 'Relativity',
          items: []
        }, {
          title: 'Optics',
          items: []
        }]
      }]
    }, {
      title: 'Technology',
      items: [{
        title: 'Computers',
        items: [{
          title: 'Computer science',
          items: []
        }, {
          title: 'Software Engineering',
          items: []
        }, {
          title: 'Web',
          items: [{
            title: 'Open source',
            items: []
          }, {
            title: 'Web design',
            items: []
          }]
        }]
      }, {
        title: 'Airplanes',
        items: []
      }]
    }, {
      title: 'Art',
      items: [{
        title: 'Literature',
        items: [{
          title: 'Poetry',
          items: [{
            title: 'Rainer Maria Rilke',
            items: []
          }, {
            title: 'Cemal Süreya',
            items: []
          }, {
            title: 'Nazım Hikmet',
            items: []
          }]
        }, {
          title: 'American writers',
          items: [{
            title: 'John Fante',
            items: []
          }, {
            title: 'J. D. Salinger',
            items: []
          }, {
            title: 'Richard Brautigan',
            items: []
          }, {
            title: 'William Burroughs',
            items: []
          }, {
            title: 'James Baldwin',
            items: []
          }]
        }]
      }, {
        title: 'Photography',
        items: [{
          title: 'Astrophotography',
          items: []
        }, {
          title: 'Macro',
          items: []
        }, {
          title: 'Time-lapse',
          items: []
        }]
      }, {
        title: 'Architecture',
        items: [{
          title: 'Art nouveau',
          items: []
        }, {
          title: 'Neoclassical',
          items: []
        }, {
          title: 'Brutalist',
          items: []
        }, {
          title: 'Ottoman Baroque',
          items: []
        }]
      }]
    }]
  }
  
  const getTopicTemplate = ({ level, prevRotation }) =>
    ({ title, items }, i = 0, a = ['']) => {
      const range = 180 - 5 * level
      const step = range / a.length
      const rotation = (step * (a.length / 2) * -1) + step * (i + 0.5)
      const totalRotation = prevRotation + rotation
      const nextLevel = Math.min(6, level + 1)
      const fixedRotation = totalRotation < -90 || totalRotation > 90 ? -180 : 0
      const topicTemplate = getTopicTemplate({ level: nextLevel, prevRotation: totalRotation })
      return `
        <details open style="--rotation: ${rotation}deg; --level: ${level}; --i: ${i};">
          <summary style="--fixed-rotation: ${fixedRotation}deg;">
            <h${level}>${title}</h${level}>
          </summary>
          <div class="items">
            ${items.map(topicTemplate).join('')}
          </div>
        </details>
      `
    }
  
  const topicTemplate = getTopicTemplate({ level: 1, prevRotation: 0 })
  container.innerHTML = topicTemplate(topics)