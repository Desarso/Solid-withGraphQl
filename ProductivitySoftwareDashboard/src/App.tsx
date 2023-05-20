import type { Component } from 'solid-js';


//here I need to import from cavas API
//the grades of all classes
//and all assignments
//I then filter the assignments by due date
//only get the ones for the next few weeks
//then I need to do math to figure out the grade percent value.

//unfortunately, I grading policies vary greatly. For english I will likely need to scraping of the calendar set forth furthermore,
//since writting assigment account a for a whole letter grade is wrtting assigment is effectively 10% of the grade despite the fact that there are 24 assignemnts.
//I can actually get ahead of the pact by completting many of the assignements early for english, this can only happend if I set asside many hours for the work.
//okay so the assignemtn list should show up as a list of assignemnts and they should be sorted by grade percentage value,
//those I will do for four hours a week.
//A lot of the assignment seem to be not available on canvas, I think the easiest way to this will be to store the assignemts in a json in
//the program itself.




const App: Component = () => {
  return (
    <div>
      <ul>
        <li>Anthro: 90%</li>
        <li>Math 10%</li>
        <li>Physics 3%</li>
      </ul>
      <hr></hr>
      <ol>
        <li>Anthro quiz || due: tuesday, may 5 || 5.37 value</li>
      </ol>
    </div>
  );
};

export default App;
