import {Tabs} from './Tabs'
import { TabsBody } from './TabsBody'
import stackIcon from '../assets/Stack.svg'

export default {
  component: Tabs,
  title: 'Tabs/Tabs',
  tags: ['autodocs'],
  parameters: {
    // layout: 'centered',
    direction: 'rtl'
  },
}



export const Default = () => {
  const tabs = [
    {
      name: 'Tab1',
      icon: stackIcon,
      header: <TabsBody />,
      body: (
        <div>
          Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
          lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork
          tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica.
          DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork. Williamsburg banh
          mi whatever gluten-free, carles pitchfork biodiesel fixie etsy retro mlkshk vice blog.
          Scenester cred you probably haven't heard of them, vinyl craft beer blog stumptown.
          Pitchfork sustainable tofu synth chambray yr.
        </div>
      ),
    },
    {
      name: 'Tab2',
      icon: stackIcon,
      header: <TabsBody />,
      body: (
        <div>
          Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
          lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork
          tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica.
          DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork. Williamsburg banh
          mi whatever gluten-free, carles pitchfork biodiesel fixie etsy retro mlkshk vice blog.
          Scenester cred you probably haven't heard of them, vinyl craft beer blog stumptown.
          Pitchfork sustainable tofu synth chambray yr.
        </div>
      ),
    },
    {
      name: 'Tab3',
      icon: stackIcon,
          header: <TabsBody />,
  
      body: (
        <div>
          Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic
          lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork
          tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica.
          DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork. Williamsburg banh
          mi whatever gluten-free, carles pitchfork biodiesel fixie etsy retro mlkshk vice blog.
          Scenester cred you probably haven't heard of them, vinyl craft beer blog stumptown.
          Pitchfork sustainable tofu synth chambray yr.
        </div>
      ),
    },
  ]
  
  return (
      <Tabs tabs={tabs} />

  )
}
