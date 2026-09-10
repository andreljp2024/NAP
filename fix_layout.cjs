const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Add BookOpen icon and Tooltip import
if (!code.includes('BookOpen')) {
  code = code.replace("Settings,", "Settings, BookOpen,");
}
code = code.replace("import { NavLink, Outlet } from 'react-router-dom';", "import { NavLink, Outlet } from 'react-router-dom';\nimport { Tooltip } from './Tooltip';");

// Add Ajuda in Administration
const adminFind = `<NavItem to="/admin/configuracoes" icon={<Settings size={18} />} label="Super Admin" isCollapsed={isCollapsed} />`;
const adminReplace = `${adminFind}
              <NavItem to="/admin/ajuda" icon={<BookOpen size={18} />} label="Base de Conhecimento" isCollapsed={isCollapsed} />`;
code = code.replace(adminFind, adminReplace);

// Fix NavItem to use Tooltip when collapsed
const navItemFind = `function NavItem({ to, icon, label, badge, isCollapsed }: NavItemProps) {
  return (
    <NavLink`;
    
const navItemReplace = `function NavItem({ to, icon, label, badge, isCollapsed }: NavItemProps) {
  const content = (
    <NavLink`;
    
const navItemEndFind = `          )}
        </>
      )}
    </NavLink>
  );
}`;

const navItemEndReplace = `          )}
        </>
      )}
    </NavLink>
  );
  
  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right" className="w-full">
        {content}
      </Tooltip>
    );
  }
  
  return content;
}`;

code = code.replace(navItemFind, navItemReplace);
code = code.replace(navItemEndFind, navItemEndReplace);

fs.writeFileSync('src/components/Layout.tsx', code);
