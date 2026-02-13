import { createServer, Model, Factory, Response } from 'miragejs';
import { User, Item } from '@/types';

export function makeServer() {
  return createServer({
    models: {
      user: Model.extend<Partial<User>>({}),
      item: Model.extend<Partial<Item>>({}),
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          const firstNames = [
            'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa',
            'William', 'Maria', 'James', 'Jennifer', 'Christopher', 'Linda', 'Daniel',
            'Patricia', 'Matthew', 'Barbara', 'Andrew', 'Susan', 'Joshua', 'Jessica',
            'Ryan', 'Nancy', 'Brian', 'Karen', 'Kevin', 'Betty', 'Jason', 'Helen',
            'Thomas', 'Sandra', 'Joseph', 'Donna', 'Charles', 'Carol', 'Steven', 'Ruth',
            'Paul', 'Sharon', 'Mark', 'Michelle', 'Donald', 'Laura', 'George', 'Sarah',
            'Kenneth', 'Kimberly', 'Steven', 'Deborah'
          ];
          const lastNames = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
            'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
            'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
          ];
          return `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / 2) % lastNames.length]}`;
        },
        email(i: number) {
          const firstNames = [
            'john', 'jane', 'michael', 'sarah', 'david', 'emma', 'robert', 'lisa',
            'william', 'maria', 'james', 'jennifer', 'christopher', 'linda', 'daniel',
            'patricia', 'matthew', 'barbara', 'andrew', 'susan', 'joshua', 'jessica',
            'ryan', 'nancy', 'brian', 'karen', 'kevin', 'betty', 'jason', 'helen',
            'thomas', 'sandra', 'joseph', 'donna', 'charles', 'carol', 'steven', 'ruth',
            'paul', 'sharon', 'mark', 'michelle', 'donald', 'laura', 'george', 'sarah',
            'kenneth', 'kimberly', 'steven', 'deborah'
          ];
          const lastNames = [
            'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis',
            'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson',
            'thomas', 'taylor', 'moore', 'jackson', 'martin', 'lee', 'perez', 'thompson',
            'white', 'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson'
          ];
          return `${firstNames[i % firstNames.length]}.${lastNames[Math.floor(i / 2) % lastNames.length]}@company.com`;
        },
        role(i: number) {
          // First 5 users are deployers, rest are reviewers
          return i < 5 ? 'Rule_Deployer' : 'Rule_Reviewer';
        },
      }),

      item: Factory.extend({
        name(i: number) {
          const items = [
            'Dell XPS 15 Laptop',
            'LG UltraWide Monitor 34"',
            'Mechanical Keyboard RGB',
            'Logitech MX Master Mouse',
            'Standing Desk Electric',
            'Ergonomic Office Chair',
            'HP LaserJet Printer',
            'Canon Document Scanner',
            'MacBook Pro 16"',
            'Samsung Curved Monitor',
            'Wireless Keyboard',
            'Trackpad Magic',
            'Adjustable Desk Riser',
            'Executive Leather Chair',
            'Brother Color Printer',
            'Epson Receipt Scanner',
            'ThinkPad T14 Laptop',
            'BenQ Designer Monitor',
            'Gaming Keyboard',
            'Vertical Ergonomic Mouse',
            'Bamboo Standing Desk',
            'Mesh Back Office Chair',
            'Multifunction Printer',
            'Portable Scanner',
            'Surface Laptop Studio',
            'ASUS ProArt Display',
            'Compact Keyboard',
            'Bluetooth Mouse',
            'Corner L-Desk',
            'Task Chair with Arms',
            'Inkjet All-in-One',
            'Sheetfed Scanner',
            'HP EliteBook Laptop',
            'Ultrawide Gaming Monitor',
            'Split Ergonomic Keyboard',
            'Travel Mouse Wireless',
            'Height Adjustable Desk',
            'Conference Room Chair',
            'Laser Printer Color',
            'High-Speed Scanner',
            'Lenovo Yoga Laptop',
            'Dell UltraSharp Monitor',
            'Backlit Keyboard',
            'Precision Mouse',
            'Executive Office Desk',
            'Visitor Chair Set',
            'Network Printer',
            'Flatbed Scanner',
            'ASUS VivoBook',
            'AOC Gaming Monitor'
          ];
          return items[i % items.length];
        },
        category(i: number) {
          const categories = [
            'Laptops',
            'Monitors',
            'Input Devices',
            'Input Devices',
            'Furniture',
            'Furniture',
            'Printers',
            'Scanners',
            'Laptops',
            'Monitors',
            'Input Devices',
            'Input Devices',
            'Furniture',
            'Furniture',
            'Printers',
            'Scanners'
          ];
          return categories[i % categories.length];
        },
        status(i: number) {
          const statuses: Array<'active' | 'inactive' | 'pending'> = ['active', 'active', 'active', 'inactive', 'pending'];
          return statuses[i % statuses.length];
        },
        createdAt(i: number) {
          const date = new Date();
          date.setDate(date.getDate() - (i * 7)); // Each item created 7 days apart
          return date.toISOString();
        },
      }),
    },

    seeds(server) {
      server.createList('user', 50);
      server.createList('item', 80);
    },

    routes() {
      this.namespace = 'api';
      this.timing = 500;

      // User report endpoints
      this.get('/reports/user-logins', (schema, request) => {
        const { page = '0', pageSize = '10', search = '' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        let users = schema.all('user').models;

        if (search) {
          const searchLower = String(search).toLowerCase();
          users = users.filter(
            (user: any) =>
              user.name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower) ||
              String(user.role).toLowerCase().includes(searchLower)
          );
        }

        const total = users.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginatedUsers = users.slice(start, end);

        const data = paginatedUsers.map((user: any, index: number) => {
          const date = new Date();
          const daysAgo = (pageNum * pageSizeNum) + index + 1;
          date.setDate(date.getDate() - daysAgo);
          date.setHours(9 + (index % 9), (index * 7) % 60);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: date.toISOString(),
          };
        });

        return {
          data,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.get('/reports/user-report', (_schema, request) => {
        const { page = '0', pageSize = '10' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const users = [
          { clientId: '1001', portfolioName: 'Alpha', fullName: 'John Smith', userName: 'john.smith', groupName: 'Admin Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1002', portfolioName: 'Beta', fullName: 'Jane Johnson', userName: 'jane.johnson', groupName: 'Finance Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1003', portfolioName: 'Gamma', fullName: 'Michael Brown', userName: 'michael.brown', groupName: 'Risk Group', userStatus: 'Inactive', emailEnable: 'No' },
          { clientId: '1004', portfolioName: 'Delta', fullName: 'Sarah Davis', userName: 'sarah.davis', groupName: 'Audit Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1005', portfolioName: 'Omega', fullName: 'David Wilson', userName: 'david.wilson', groupName: 'Compliance Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1001', portfolioName: 'Alpha', fullName: 'Lisa Anderson', userName: 'lisa.anderson', groupName: 'Admin Group', userStatus: 'Pending', emailEnable: 'Yes' },
          { clientId: '1002', portfolioName: 'Beta', fullName: 'Robert Taylor', userName: 'robert.taylor', groupName: 'Finance Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1003', portfolioName: 'Gamma', fullName: 'Emily White', userName: 'emily.white', groupName: 'Risk Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1004', portfolioName: 'Delta', fullName: 'Thomas Lee', userName: 'thomas.lee', groupName: 'Audit Group', userStatus: 'Inactive', emailEnable: 'Yes' },
          { clientId: '1005', portfolioName: 'Omega', fullName: 'Jessica Garcia', userName: 'jessica.garcia', groupName: 'Compliance Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1001', portfolioName: 'Alpha', fullName: 'Daniel Martinez', userName: 'daniel.martinez', groupName: 'Operations Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1002', portfolioName: 'Beta', fullName: 'Ashley Rodriguez', userName: 'ashley.rodriguez', groupName: 'Security Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1003', portfolioName: 'Gamma', fullName: 'Christopher Moore', userName: 'christopher.moore', groupName: 'IT Group', userStatus: 'Pending', emailEnable: 'Yes' },
          { clientId: '1004', portfolioName: 'Delta', fullName: 'Amanda Clark', userName: 'amanda.clark', groupName: 'Legal Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1005', portfolioName: 'Omega', fullName: 'Matthew Lewis', userName: 'matthew.lewis', groupName: 'Marketing Group', userStatus: 'Active', emailEnable: 'Yes' }
        ];

        const totalRecords = 250;
        const data = Array.from({ length: totalRecords }, (_v, i) => {
          const user = users[i % users.length];

          return {
            id: String(i + 1),
            clientId: user.clientId,
            portfolioName: user.portfolioName,
            fullName: user.fullName,
            userName: user.userName,
            groupName: user.groupName,
            userStatus: user.userStatus,
            emailEnable: user.emailEnable,
          };
        });

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.post('/reports/user-report/search', (_schema, request) => {
        const body = JSON.parse(request.requestBody || '{}');
        const { page = 0, pageSize = 10, clientId = '', portfolioName = '' } = body;

        const users = [
          { clientId: '1001', portfolioName: 'Alpha', fullName: 'John Smith', userName: 'john.smith', groupName: 'Admin Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1002', portfolioName: 'Beta', fullName: 'Jane Johnson', userName: 'jane.johnson', groupName: 'Finance Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1003', portfolioName: 'Gamma', fullName: 'Michael Brown', userName: 'michael.brown', groupName: 'Risk Group', userStatus: 'Inactive', emailEnable: 'No' },
          { clientId: '1004', portfolioName: 'Delta', fullName: 'Sarah Davis', userName: 'sarah.davis', groupName: 'Audit Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1005', portfolioName: 'Omega', fullName: 'David Wilson', userName: 'david.wilson', groupName: 'Compliance Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1001', portfolioName: 'Alpha', fullName: 'Lisa Anderson', userName: 'lisa.anderson', groupName: 'Admin Group', userStatus: 'Pending', emailEnable: 'Yes' },
          { clientId: '1002', portfolioName: 'Beta', fullName: 'Robert Taylor', userName: 'robert.taylor', groupName: 'Finance Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1003', portfolioName: 'Gamma', fullName: 'Emily White', userName: 'emily.white', groupName: 'Risk Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1004', portfolioName: 'Delta', fullName: 'Thomas Lee', userName: 'thomas.lee', groupName: 'Audit Group', userStatus: 'Inactive', emailEnable: 'Yes' },
          { clientId: '1005', portfolioName: 'Omega', fullName: 'Jessica Garcia', userName: 'jessica.garcia', groupName: 'Compliance Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1001', portfolioName: 'Alpha', fullName: 'Daniel Martinez', userName: 'daniel.martinez', groupName: 'Operations Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1002', portfolioName: 'Beta', fullName: 'Ashley Rodriguez', userName: 'ashley.rodriguez', groupName: 'Security Group', userStatus: 'Active', emailEnable: 'Yes' },
          { clientId: '1003', portfolioName: 'Gamma', fullName: 'Christopher Moore', userName: 'christopher.moore', groupName: 'IT Group', userStatus: 'Pending', emailEnable: 'Yes' },
          { clientId: '1004', portfolioName: 'Delta', fullName: 'Amanda Clark', userName: 'amanda.clark', groupName: 'Legal Group', userStatus: 'Active', emailEnable: 'No' },
          { clientId: '1005', portfolioName: 'Omega', fullName: 'Matthew Lewis', userName: 'matthew.lewis', groupName: 'Marketing Group', userStatus: 'Active', emailEnable: 'Yes' }
        ];

        let data = Array.from({ length: 250 }, (_v, i) => {
          const user = users[i % users.length];

          return {
            id: String(i + 1),
            clientId: user.clientId,
            portfolioName: user.portfolioName,
            fullName: user.fullName,
            userName: user.userName,
            groupName: user.groupName,
            userStatus: user.userStatus,
            emailEnable: user.emailEnable,
          };
        });

        if (clientId) {
          data = data.filter((row) => row.clientId === String(clientId));
        }

        if (portfolioName) {
          const lower = String(portfolioName).toLowerCase();
          data = data.filter((row) => row.portfolioName.toLowerCase().includes(lower));
        }

        const total = data.length;
        const start = page * pageSize;
        const end = start + pageSize;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page,
          pageSize,
        };
      });

      this.get('/reports/unique-user-logins', (_schema, request) => {
        const { page = '0', pageSize = '10' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const clients = [
          { clientId: '1001', portfolioName: 'Alpha' },
          { clientId: '1002', portfolioName: 'Beta' },
          { clientId: '1003', portfolioName: 'Gamma' },
        ];

        const totalRecords = 60;
        const data = Array.from({ length: totalRecords }, (_v, i) => {
          const client = clients[i % clients.length];
          const hour = (i % 24).toString().padStart(2, '0');
          return {
            id: String(i + 1),
            time: `${hour}:00`,
            day6: (i + 6) % 50,
            day5a: (i + 5) % 50,
            day5b: (i + 15) % 50,
            day4: (i + 4) % 50,
            day3: (i + 3) % 50,
            day2: (i + 2) % 50,
            day1: (i + 1) % 50,
            day0: i % 50,
            clientId: client.clientId,
            portfolioName: client.portfolioName,
          };
        });

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.post('/reports/unique-user-logins/search', (_schema, request) => {
        const body = JSON.parse(request.requestBody || '{}');
        const { page = 0, pageSize = 10, clientId = '', portfolioName = '' } = body;

        const clients = [
          { clientId: '1001', portfolioName: 'Alpha' },
          { clientId: '1002', portfolioName: 'Beta' },
          { clientId: '1003', portfolioName: 'Gamma' },
        ];

        let data = Array.from({ length: 60 }, (_v, i) => {
          const client = clients[i % clients.length];
          const hour = (i % 24).toString().padStart(2, '0');
          return {
            id: String(i + 1),
            time: `${hour}:00`,
            day6: (i + 6) % 50,
            day5a: (i + 5) % 50,
            day5b: (i + 15) % 50,
            day4: (i + 4) % 50,
            day3: (i + 3) % 50,
            day2: (i + 2) % 50,
            day1: (i + 1) % 50,
            day0: i % 50,
            clientId: client.clientId,
            portfolioName: client.portfolioName,
          };
        });

        if (clientId) {
          data = data.filter((row) => row.clientId === String(clientId));
        }

        if (portfolioName) {
          const lower = String(portfolioName).toLowerCase();
          data = data.filter((row) => row.portfolioName.toLowerCase().includes(lower));
        }

        const total = data.length;
        const start = page * pageSize;
        const end = start + pageSize;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page,
          pageSize,
        };
      });

      this.get('/reports/rule-count', (_schema, request) => {
        const { page = '0', pageSize = '10', runWindow = '', date = '' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const categories = ['Authorization', 'Fraud', 'Compliance', 'Limits', 'Scoring'];
        const ruleSets = ['Core Rules', 'Risk Rules', 'Velocity Rules', 'Whitelist Rules', 'Blacklist Rules'];
        const actions = ['Added', 'Updated', 'Deleted'];

        const totalRecords = 45;
        let data = Array.from({ length: totalRecords }, (_v, i) => ({
          id: String(i + 1),
          ruleCategoryName: categories[i % categories.length],
          ruleSetName: ruleSets[i % ruleSets.length],
          action: actions[i % actions.length],
          ruleCount: 10 + (i % 20),
          runWindow: ['Noon', 'Evening', 'Emergency'][i % 3],
          date: date || new Date().toISOString().slice(0, 10),
        }));

        if (runWindow) {
          data = data.filter((row) => row.runWindow === runWindow);
        }

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      // Rule changes report
      this.get('/reports/rule-changes', (_schema, request) => {
        const { page = '0', pageSize = '10', search = '' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const categories = ['Authorization', 'Fraud', 'Compliance', 'Limits', 'Scoring'];
        const ruleSets = ['Core Rules', 'Risk Rules', 'Velocity Rules', 'Whitelist Rules', 'Blacklist Rules'];
        const ruleNames = [
          'Daily Spend Limit',
          'MCC Block',
          'Geo Velocity',
          'High Risk Country',
          'PIN Retry Limit',
          'Offline Amount Cap',
          'Merchant Category Allow',
          'Card Present Required',
          'International Usage',
          'Transaction Amount Range',
        ];
        const ruleModes = ['Enabled', 'Disabled', 'Monitor'];
        const compareValues = ['Changed', 'Unchanged', 'Added', 'Removed'];

        const totalRecords = 60;
        let data = Array.from({ length: totalRecords }, (_v, i) => {
          return {
            id: String(i + 1),
            ruleCategory: categories[i % categories.length],
            ruleSet: ruleSets[i % ruleSets.length],
            ruleName: ruleNames[i % ruleNames.length],
            ruleMode: ruleModes[i % ruleModes.length],
            compare: compareValues[i % compareValues.length],
          };
        });

        if (search) {
          const searchLower = String(search).toLowerCase();
          data = data.filter((row) =>
            [row.ruleCategory, row.ruleSet, row.ruleName, row.ruleMode, row.compare]
              .join(' ')
              .toLowerCase()
              .includes(searchLower)
          );
        }

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      // New rule history API endpoint
      this.post('/rules/v1/ruleHistoryList', (_schema, request) => {
        const body = JSON.parse(request.requestBody);
        const {
          ruleFromDate = '',
          ruleDateTo = '',
          pageNum = 0,
          pageSize = 10,
          counter = 0,
          ruleName = '',
          ruleTime = '',
        } = body;

        // Parse date format from "1-NOV-2025" to Date object
        const parseDate = (dateString: string) => {
          if (!dateString) return null;
          const months = {
            'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
            'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11,
          };
          const parts = dateString.split('-');
          if (parts.length !== 3) return null;
          const day = parseInt(parts[0]);
          const month = months[parts[1] as keyof typeof months];
          const year = parseInt(parts[2]);
          return new Date(year, month, day);
        };

        const categories = ['Authorization', 'Fraud', 'Compliance', 'Limits', 'Scoring'];
        const ruleSets = ['Core Rules', 'Risk Rules', 'Velocity Rules', 'Whitelist Rules', 'Blacklist Rules'];
        const ruleNames = [
          'Daily Spend Limit',
          'MCC Block',
          'Geo Velocity',
          'High Risk Country',
          'PIN Retry Limit',
          'Offline Amount Cap',
          'Merchant Category Allow',
          'Card Present Required',
          'International Usage',
          'Transaction Amount Range',
        ];
        const modes = ['Enabled', 'Disabled', 'Monitor'];
        const indicators = ['A', 'B', 'C', 'D'];
        const windows = ['Noon', 'Evening'];

        const totalRecords = 90;
        let data = Array.from({ length: totalRecords }, (_v, i) => {
          const created = new Date();
          created.setDate(created.getDate() - i);
          created.setHours(9 + (i % 10), (i * 7) % 60);

          return {
            id: String(i + 1),
            ruleCategory: categories[i % categories.length],
            ruleSetName: ruleSets[i % ruleSets.length],
            ruleName: ruleNames[i % ruleNames.length],
            ruleMode: modes[i % modes.length],
            ruleActvIndc: indicators[i % indicators.length],
            crteTms: created.toISOString(),
            runWindow: windows[i % windows.length],
          };
        });

        if (ruleName) {
          const ruleLower = String(ruleName).toLowerCase();
          data = data.filter((row) => row.ruleName.toLowerCase().includes(ruleLower));
        }

        if (ruleTime) {
          data = data.filter((row) => row.runWindow === ruleTime);
        }

        if (ruleFromDate) {
          const start = parseDate(String(ruleFromDate));
          if (start) {
            data = data.filter((row) => new Date(row.crteTms) >= start);
          }
        }

        if (ruleDateTo) {
          const end = parseDate(String(ruleDateTo));
          if (end) {
            data = data.filter((row) => new Date(row.crteTms) <= end);
          }
        }

        const totalRecordsFiltered = data.length;
        const start = pageNum * pageSize;
        const end = start + pageSize;
        const paginated = data.slice(start, end);

        return {
          code: '200',
          message: 'Success',
          ruleHistoryList: paginated,
          totalRecords: totalRecordsFiltered,
        };
      });

      this.get('/reports/rule-history', (_schema, request) => {
        const {
          page = '0',
          pageSize = '10',
          ruleName = '',
          runWindow = '',
          startDate = '',
          endDate = '',
        } = request.queryParams;

        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const categories = ['Authorization', 'Fraud', 'Compliance', 'Limits', 'Scoring'];
        const ruleSets = ['Core Rules', 'Risk Rules', 'Velocity Rules', 'Whitelist Rules', 'Blacklist Rules'];
        const ruleNames = [
          'Daily Spend Limit',
          'MCC Block',
          'Geo Velocity',
          'High Risk Country',
          'PIN Retry Limit',
          'Offline Amount Cap',
          'Merchant Category Allow',
          'Card Present Required',
          'International Usage',
          'Transaction Amount Range',
        ];
        const modes = ['Enabled', 'Disabled', 'Monitor'];
        const indicators = ['A', 'B', 'C', 'D'];
        const windows = ['Noon', 'Evening'];

        const totalRecords = 90;
        let data = Array.from({ length: totalRecords }, (_v, i) => {
          const created = new Date();
          created.setDate(created.getDate() - i);
          created.setHours(9 + (i % 10), (i * 7) % 60);

          return {
            id: String(i + 1),
            ruleCategory: categories[i % categories.length],
            ruleSetName: ruleSets[i % ruleSets.length],
            ruleName: ruleNames[i % ruleNames.length],
            ruleMode: modes[i % modes.length],
            ruleActvIndc: indicators[i % indicators.length],
            crteTms: created.toISOString(),
            runWindow: windows[i % windows.length],
          };
        });

        if (ruleName) {
          const ruleLower = String(ruleName).toLowerCase();
          data = data.filter((row) => row.ruleName.toLowerCase().includes(ruleLower));
        }

        if (runWindow) {
          data = data.filter((row) => row.runWindow === runWindow);
        }

        if (startDate) {
          const start = new Date(String(startDate));
          data = data.filter((row) => new Date(row.crteTms) >= start);
        }

        if (endDate) {
          const end = new Date(String(endDate));
          data = data.filter((row) => new Date(row.crteTms) <= end);
        }

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.get('/reports/rule-scheduler', (_schema, request) => {
        const {
          page = '0',
          pageSize = '10',
          ruleName = '',
          runWindow = '',
          startDate = '',
          endDate = '',
        } = request.queryParams;

        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const categories = ['Authorization', 'Fraud', 'Compliance', 'Limits', 'Scoring'];
        const ruleSets = ['Core Rules', 'Risk Rules', 'Velocity Rules', 'Whitelist Rules', 'Blacklist Rules'];
        const ruleNames = [
          'Daily Spend Limit',
          'MCC Block',
          'Geo Velocity',
          'High Risk Country',
          'PIN Retry Limit',
          'Offline Amount Cap',
          'Merchant Category Allow',
          'Card Present Required',
          'International Usage',
          'Transaction Amount Range',
        ];
        const modes = ['Enabled', 'Disabled', 'Monitor'];
        const windows = ['Noon', 'Evening', 'Emergency'];
        const users = ['John Smith', 'Jane Johnson', 'Michael Brown', 'Sarah Davis', 'David Wilson'];
        const systems = ['CoreSystem', 'RuleEngine', 'FraudShield'];
        const financiers = ['FinCorp', 'BankOne', 'TrustX'];
        const actionTypes = ['Create', 'Update', 'Delete'];

        const totalRecords = 120;
        let data = Array.from({ length: totalRecords }, (_v, i) => {
          const created = new Date();
          created.setDate(created.getDate() - i);
          created.setHours(9 + (i % 10), (i * 7) % 60);

          return {
            id: String(i + 1),
            ruleCategory: categories[i % categories.length],
            ruleSet: ruleSets[i % ruleSets.length],
            ruleName: ruleNames[i % ruleNames.length],
            mode: modes[i % modes.length],
            ruleModeCode: 'T',
            activeIndicator: i % 2 === 0 ? 'Y' : 'N',
            scheduleDate: created.toISOString().slice(0, 10),
            scheduleTime: created.toISOString().slice(11, 16),
            approverFullName: users[i % users.length],
            approverSetValue: `SET-${(i % 5) + 1}`,
            ownerFullName: users[(i + 1) % users.length],
            typeDescription: `Type ${((i % 3) + 1).toString()}`,
            ruleModeDescription: `Mode ${modes[i % modes.length]}`,
            schedulerFullName: users[(i + 2) % users.length],
            systemName: systems[i % systems.length],
            financierEmailId: `fin${(i % 5) + 1}@example.com`,
            financerName: financiers[i % financiers.length],
            formStatValue: `FS-${(i % 4) + 1}`,
            actionTypeValue: actionTypes[i % actionTypes.length],
            runWindow: windows[i % windows.length],
            createdAt: created.toISOString(),
          };
        });

        if (ruleName) {
          const ruleLower = String(ruleName).toLowerCase();
          data = data.filter((row) => row.ruleName.toLowerCase().includes(ruleLower));
        }

        if (runWindow) {
          data = data.filter((row) => row.runWindow === runWindow);
        }

        if (startDate) {
          const start = new Date(String(startDate));
          data = data.filter((row) => new Date(row.createdAt) >= start);
        }

        if (endDate) {
          const end = new Date(String(endDate));
          data = data.filter((row) => new Date(row.createdAt) <= end);
        }

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      // New refresh history endpoints with appended operation type
      this.get('/rules/v1/refreshHistory/:operationType', (_schema, request) => {
        const { operationType } = request.params;
        const { page = '0', pageSize = '10' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const users = [
          { id: 'u1', name: 'John Smith' },
          { id: 'u2', name: 'Jane Johnson' },
          { id: 'u3', name: 'Michael Brown' },
          { id: 'u4', name: 'Sarah Davis' },
        ];

        const opTypeMap: Record<string, string> = {
          'Synch_Stage': 'Staging Refreshed',
          'Sync_Prod': 'Production Refreshed',
          'Rule_Schedule': 'Rule Schedule',
        };

        const totalRecords = 60;
        let data = Array.from({ length: totalRecords }, (_v, i) => {
          const created = new Date();
          created.setMinutes(created.getMinutes() - i * 15);
          const user = users[i % users.length];

          return {
            id: String(i + 1),
            userId: user.id,
            fullName: user.name,
            operationType: opTypeMap[String(operationType)] || String(operationType),
            createTms: created.toISOString(),
          };
        });

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      // Client-side pagination endpoint - returns all data
      this.get('/rules/v1/refreshHistory/:operationType/all', (_schema, request) => {
        const { operationType } = request.params;

        const users = [
          { id: 'u1', name: 'John Smith' },
          { id: 'u2', name: 'Jane Johnson' },
          { id: 'u3', name: 'Michael Brown' },
          { id: 'u4', name: 'Sarah Davis' },
        ];

        const opTypeMap: Record<string, string> = {
          'Synch_Stage': 'Staging Refreshed',
          'Sync_Prod': 'Production Refreshed',
          'Rule_Schedule': 'Rule Schedule',
        };

        const totalRecords = 60;
        const data = Array.from({ length: totalRecords }, (_v, i) => {
          const created = new Date();
          created.setMinutes(created.getMinutes() - i * 15);
          const user = users[i % users.length];

          return {
            id: String(i + 1),
            userId: user.id,
            fullName: user.name,
            operationType: opTypeMap[String(operationType)] || String(operationType),
            createTms: created.toISOString(),
          };
        });

        return {
          data,
          total: data.length,
        };
      });

      this.get('/reports/operation-history', (_schema, request) => {
        const { page = '0', pageSize = '10', operationType = '' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        const users = [
          { id: 'u1', name: 'John Smith' },
          { id: 'u2', name: 'Jane Johnson' },
          { id: 'u3', name: 'Michael Brown' },
          { id: 'u4', name: 'Sarah Davis' },
        ];

        const ops = [
          { label: 'Staging Refreshed', value: 'Synch_Stage' },
          { label: 'Pruduction Refreshed', value: 'Sync_Prod' },
          { label: 'Rule Schedule', value: 'Rule_Schedule' },
        ];

        const totalRecords = 60;
        let data = Array.from({ length: totalRecords }, (_v, i) => {
          const created = new Date();
          created.setMinutes(created.getMinutes() - i * 15);
          const user = users[i % users.length];
          const op = ops[i % ops.length];

          return {
            id: String(i + 1),
            userId: user.id,
            fullName: user.name,
            operationType: op.label,
            operationTypeValue: op.value,
            createTms: created.toISOString(),
          };
        });

        if (operationType) {
          data = data.filter((row) => row.operationTypeValue === operationType);
        }

        const total = data.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginated = data.slice(start, end);

        return {
          data: paginated.map((row) => ({
            id: row.id,
            userId: row.userId,
            fullName: row.fullName,
            operationType: row.operationType,
            createTms: row.createTms,
          })),
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.post('/reports/refresh-staging', () => {
        return {
          success: true,
          message: 'Staging refresh is completed successfully',
        };
      });

      // Users endpoints
      this.get('/users', (schema, request) => {
        const { page = '0', pageSize = '10', search = '' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        let users = schema.all('user').models;

        if (search) {
          const searchLower = String(search).toLowerCase();
          users = users.filter(
            (user: any) =>
              user.name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower)
          );
        }

        const total = users.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginatedUsers = users.slice(start, end);

        return {
          data: paginatedUsers,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.get('/users/:id', (schema, request) => {
        const id = request.params.id;
        return schema.find('user', id);
      });

      this.post('/users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('user', attrs);
      });

      this.put('/users/:id', (schema, request) => {
        const id = request.params.id;
        const attrs = JSON.parse(request.requestBody);
        const user = schema.find('user', id);
        if (!user) {
          return new Response(404);
        }
        user.update(attrs);
        return user;
      });

      this.delete('/users/:id', (schema, request) => {
        const id = request.params.id;
        const user = schema.find('user', id);
        user?.destroy();
        return new Response(204);
      });

      // Items endpoints
      this.get('/items', (schema, request) => {
        const { page = '0', pageSize = '10', search = '' } = request.queryParams;
        const pageNum = parseInt(String(page));
        const pageSizeNum = parseInt(String(pageSize));

        let items = schema.all('item').models;

        if (search) {
          const searchLower = String(search).toLowerCase();
          items = items.filter(
            (item: any) =>
              item.name.toLowerCase().includes(searchLower) ||
              item.category.toLowerCase().includes(searchLower)
          );
        }

        const total = items.length;
        const start = pageNum * pageSizeNum;
        const end = start + pageSizeNum;
        const paginatedItems = items.slice(start, end);

        return {
          data: paginatedItems,
          total,
          page: pageNum,
          pageSize: pageSizeNum,
        };
      });

      this.get('/items/:id', (schema, request) => {
        const id = request.params.id;
        return schema.find('item', id);
      });
    },
  });
}
