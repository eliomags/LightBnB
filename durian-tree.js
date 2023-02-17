class Employee {
    constructor(name, title, salary) {
      this.name = name;
      this.title = title;
      this.salary = salary;
      this.boss = null;
      this.subordinates = [];
    }
  
    addSubordinate(subordinate) {
      this.subordinates.push(subordinate);
      subordinate.boss = this;
    }
  
    get numberOfSubordinates() {
      return this.subordinates.length;
    }
  
    get numberOfPeopleToCEO() {
      let numberOfPeople = 0;
      let currentEmployee = this;
  
      // climb "up" the tree (using iteration), counting nodes, until no boss is found
      while (currentEmployee.boss) {
        currentEmployee = currentEmployee.boss;
        numberOfPeople++;
      }
  
      return numberOfPeople;
    }
  
    hasSameBoss(employee) {
      return this.boss === employee.boss;
    }

    employeesThatMakeOver(amount) {

        let employees = []; // 1
    
        if (this.salary > amount) {
          employees.push(this); // 2
        }
    
        for (const subordinate of this.subordinates) {
          const subordinatesThatMakeOver = subordinate.employeesThatMakeOver(amount); // 3
          employees = employees.concat(subordinatesThatMakeOver);
        }
    
        return employees;
      }

       // Returns the total number of employees under this employee, including this employee
      get totalEmployees() {
        let total = 1; // count this employee
    
        // traverse all subordinates in a depth-first manner
        for (let i = 0; i < this.subordinates.length; i++) {
          total += this.subordinates[i].totalEmployees;
        }
    
        return total;
      }
  }
  
  const ada = new Employee("Ada", "CEO", 3000000.0);
  
  const craig = new Employee("Craig", "VP Software", 1000000);
  const arvinder = new Employee("Arvinder", "Chief Design Officer", 1000000);
  const angela = new Employee("Angela", "VP Retail", 1000000);
  const phil = new Employee("Phil", "VP Marketing", 1000000);
  
  const simone = new Employee("Simone");
  const ali = new Employee("Ali");
  const florida = new Employee("Florida");
  const david = new Employee("David");
  const brian = new Employee("Brian");
  const karla = new Employee("Karla");
  
  ada.addSubordinate(craig);
  ada.addSubordinate(arvinder);
  ada.addSubordinate(angela);
  ada.addSubordinate(phil);
  
  craig.addSubordinate(simone);
  craig.addSubordinate(ali);
  
  phil.addSubordinate(florida);
  phil.addSubordinate(david);
  phil.addSubordinate(brian);
  
  angela.addSubordinate(karla);
  
  console.log(craig.boss.name);
  console.log(craig.numberOfSubordinates);
  console.log(craig.numberOfPeopleToCEO);

  console.log(ada.totalEmployees) // Returns the total number of employees in the entire company.
  console.log(craig.totalEmployees) // Returns the total number of employees working in software development.