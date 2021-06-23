const ClientLinks = [
  {
    title: 'Home',
    to: '/',
    icon: 'home',
    meta: false
  },

  {
    title: 'Orders',
    icon: 'grading',
    meta: false,
    child: [
      {
        title: 'New',
        to: '/newOrder',
        icon: 'add_circle',
        meta: {
          create: true,
          edite: true,
          delete: true
        }
      },
      {
        title: 'Report',
        to: '/orderReport',
        icon: 'article',
        meta: {
          create: true,
          edite: true,
          delete: true
        }
      },
      {
        title: 'Taken',
        to: '/taken',
        icon: 'done_all',
        meta: {
          create: true,
          edite: true,
          delete: true
        }
      },

      {
        title: 'Clients',
        to: '/clients',
        icon: 'groups',
        meta: {
          create: true,
          edite: true,
          delete: true
        }
      }
    ]
  },
  {
    title: 'Company',
    icon: 'store',
    meta: false,
    child: [
      {
        title: 'Service',
        to: '/service',
        icon: 'home_repair_service',
        meta: {
          create: true,
          edite: true,
          delete: true
        }
      },
      {
        title: 'Employee',
        to: '/employees',
        icon: 'assignment_ind',
        meta: {
          create: true,
          edite: true,
          delete: true
        }
      },
      {
        title: 'Delete',
        to: '/delete',
        icon: 'delete',
        meta: {
          delete: true
        }
      }
    ]
  },
  {
    title: 'Users',
    icon: 'verified_user',
    meta: false,
    child: [
      {
        title: 'User Role',
        icon: 'manage_accounts',
        to: '/userrole',
        meta: false
      },
      {
        title: 'User List',
        icon: 'admin_panel_settings',
        to: '/userlist',
        meta: false
      }
    ]
  }
  // {
  //   title: 'New Company',
  //   to: '/newcomp',
  //   icon: 'home',
  //   meta: false
  // }
];

const AdminLinks = [
  { text: 'Home', access: 'Admin' },

  {
    access: 'Admin',
    text: 'User Role'
  },
  {
    access: 'Admin',
    text: 'User List'
  },

  {
    access: 'Admin',
    text: 'Cash Flow'
  },

  {
    access: 'Admin',
    text: 'Balance Sheet'
  },
  {
    access: 'Admin',
    text: 'Delete'
  },
  {
    access: 'Admin',
    text: 'Employee'
  },
  {
    access: 'Admin',
    text: 'New Stock'
  },
  {
    access: 'Admin',
    text: 'Transfer'
  },
  {
    access: 'Admin',
    text: 'Service'
  },
  {
    access: 'Admin',
    text: 'New'
  },
  {
    access: 'Admin',
    text: 'Report'
  },
  {
    access: 'Admin',
    text: 'Taken'
  },
  {
    access: 'Admin',
    text: 'Clients'
  },
  {
    access: 'Admin',
    text: 'Cash Dep'
  },
  {
    access: 'Admin',
    text: 'Cash Transfer'
  },
  {
    access: 'Admin',
    text: 'New Expense'
  },
  {
    access: 'Admin',
    text: 'Fixed Expense'
  },

  {
    access: 'Admin',
    text: 'Show Expenses'
  }
];
const AllLinks = [
  { text: 'Home', access: 'HQ-Admin' },
  {
    access: 'HQ-Admin',
    text: 'Charge Expense'
  },

  ...AdminLinks
];
if (process.env.NODE_ENV !== 'production')
  AllLinks.push({ text: 'New Branch', access: 'HQ-Admin' });
function Links(UserType) {
  let _links = AllLinks.filter(link => link.access === UserType);
  return _links.map(link => link.text);
}
function AcessLinks(newLinks = []) {
  return ClientLinks.reduce((accessLinks, current) => {
    if (!current.child && newLinks.includes(current.title)) {
      accessLinks.push(current);
      return accessLinks;
    }
    if (current.child && current.child.length) {
      let childLinks = current.child.filter(child => {
        return newLinks.includes(child.title);
      });
      // console.log(current.child);
      if (childLinks.length) {
        accessLinks.push({
          ...current,
          child: childLinks
        });
        return accessLinks;
      }
      return accessLinks;
    }
    return accessLinks;
  }, []);
}
module.exports = {
  Links,
  AcessLinks
};
