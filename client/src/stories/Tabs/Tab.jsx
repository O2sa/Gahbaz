import React from 'react'
import PropTypes from 'prop-types'
import { CNavItem, CNavLink, CCardImage } from '@coreui/react'
import stackIcon from '../assets/Stack.svg'
import { Link, NavLink } from 'react-router-dom'
export const Tab = ({ to, label, k, clickHandller, activeKey, TabIcon, ...props }) => {
  return (
    <CNavItem className="flex-grow-1 " role="presentation">
      <NavLink to={to}>
        <CNavLink
          active={activeKey === k}
          component="button"
          role="tab"
          key={k}
          aria-controls="home-tab-pane"
          aria-selected={activeKey === k}
          onClick={() => clickHandller(k)}
          className={`text-start border-top-0 border-end-0 border-start-0  border-primary w-100 ${
            activeKey === k ? 'border-bottom text-primary' : ' border-0 text-secondary'
          }`}
          // key={key}
          {...props}
        >
          <TabIcon className="m-2 " style={{ width: '24px' }}  />
          <h5 className="d-inline">{label}</h5>
        </CNavLink>
      </NavLink>
    </CNavItem>
  )
}

Tab.propTypes = {
  /**
   * عنوان البطاقة
   */
  label: PropTypes.string,
  /**
   * What background color to use
   */
  clickHandller: PropTypes.func,
  /**
   * How large should the button be?
   */
  activeKey: PropTypes.number,
  k: PropTypes.number,
  /**
   * Button contents
   */
  tabIcon: PropTypes.object,
}

Tab.defaultProps = {
  label: 'Tab',
  tabIcon: stackIcon,
  clickHandller: undefined,
  // activeKey: 1,
  // k: 1,
}
