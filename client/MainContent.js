import { Container, Col, Row } from "react-bootstrap";
import Sidebar from "./sidebar";
import {
  FormGroup,
  Label,
  Input,
  Table,
  UncontrolledAccordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody,
  ListGroupItem,
  ListGroup,
} from "reactstrap";

const StudentData = {
  name: "",
  id: "23233",
  collage: "Secince Collage",
  career: "Computer Secince",
  year: 3,
  grades: [
    {
      season: "الفصل الأول",
      courses: [
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
      ],
    },
    {
      season: "الفصل الأول",
      courses: [
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
      ],
    },
    {
      season: "الفصل الأول",
      courses: [
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
        {
          courseName: "برمجة واجهات",
          courseGrades: {
            presnt: 10,
            assignments: 10,
            middleExam: 10,
            lastExam: 50,
            practice: 20,
          },
        },
      ],
    },
  ],
};
const sidebarStyle = {
  height: "calc(100vh - 68px)",
  top: "68px",
};
function MainContent() {
  return (
    <div className="" style={{}}>
      <div
        className="sidebar  fixed-top  border-end col-md-3 col-lg-2 p-0"
        style={sidebarStyle}
      >
        <Sidebar />
      </div>
      <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
        <FiltersPanel />
        <GradeTable />
      </div>
    </div>
  );
}

function FiltersPanel() {
  return (
    <div
      className="w-100 position-sticky  d-flex flex-column justify-content-between align-items-start mb-4"
      style={{ height: 132, top:68 }}
    >
      <div className="route ">
        <span>الرئيسية / الدرجات</span>
      </div>
      <div>
        <FormGroup>
          <Input
            id="exampleSearch"
            name="search"
            placeholder="search placeholder"
            type="search"
          />
        </FormGroup>
      </div>
    </div>
  );
}

function SumGrade(courses) {
  var sums = {
    totalGrade: 0,
    courseSums: [],
  };
  courses.map((item, index) => {
    const CourseTotal = Object.values(item.courseGrades).reduce(
      (acc, deg) => acc + deg,
      0
    );
    sums.courseSums.push(CourseTotal);
    sums.totalGrade = sums.totalGrade + CourseTotal;
  });
  // console.log(sums);
  return sums;
}

SumGrade(StudentData.grades[0].courses);
function GradeTable() {
  return (
    <div className="ms-4" style={{}}>
      {StudentData.grades.map((item, index) => (
        <div className="term-header">
          <UncontrolledAccordion defaultOpen={["1", "2"]} stayOpen>
            <AccordionItem>
              <AccordionHeader targetId={index.toString()}>
                <ListGroup
                  className="d-flex justify-content-around w-100"
                  flush={false}
                  horizontal
                >
                  <ListGroupItem className="border-0">
                    {item.season}
                  </ListGroupItem>
                  <ListGroupItem className="border-0">
                    عدد المواد: {item.courses.length}
                  </ListGroupItem>
                  <ListGroupItem className="border-0">
                    مجموع الدرجات: {SumGrade(item.courses).totalGrade}
                  </ListGroupItem>
                  <ListGroupItem className="border-0">
                    النسبة المئوية:{" "}
                    {SumGrade(item.courses).totalGrade / item.courses.length}%
                  </ListGroupItem>
                </ListGroup>{" "}
              </AccordionHeader>
              <AccordionBody accordionId={index.toString()}>
                <div>
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الدورة</th>
                        <th>الحضور</th>
                        <th>التكاليف</th>
                        <th>الاختبار النصفي</th>
                        <th>الاختبار النهائي</th>
                        <th>العملي</th>
                        <th>المجموع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item.courses.map((course, index) => (
                        <tr>
                          <th scope="row">1</th>
                          <td> {course.courseName}</td>
                          <td>{course.courseGrades.presnt}</td>
                          <td>{course.courseGrades.assignments}</td>
                          <td>{course.courseGrades.middleExam}</td>
                          <td>{course.courseGrades.lastExam}</td>
                          <td>{course.courseGrades.practice}</td>
                          <td>{SumGrade(item.courses).courseSums[index]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </AccordionBody>
            </AccordionItem>
          </UncontrolledAccordion>
        </div>
      ))}
    </div>
  );
}
export default MainContent;
