// server.js
import { createServer, Model, Factory, Response } from 'miragejs'
export function makeServer() {
  let server = createServer({
    models: {
      semester: Model,
      course: Model,
      collage: Model,
      subject: Model,
      field: Model,
      semesterTemplate: Model,
    },

    factories: {
      semester: Factory.extend({
        name: 'Fall 2022',
        coursesNum: '3',
        studentsNum: '50',
        level: 'Undergraduate',
        field: 'Computer Science',
        startDate: '2022-09-01',
        endDate: '2022-12-20',
        completed: false,
      }),

      course: Factory.extend({
        name: ' تصميم وتحليل النظم الادارية',
        subtitle:
          'معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و نحققه.',
        describtion: `معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
        نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
        جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون
        سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن
        يكون سهلاً جداً و نحققه.معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل
        أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,
        بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في
        تحقيقه, بل أن يكون سهلاً جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق
        في تحقيقه, بل أن يكون سهلاً جداً و نحققه.`,
        image: 'course_image.jpg',
        secince: 'Computer Science',
        willLearn: [
          ` معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
        نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
        جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً`,
          ` معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
        نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
        جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً`,
          ` معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
        نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
        جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً`,
          ` معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً جداً و
        نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه, بل أن يكون سهلاً
        جداً و نحققه. معظمنا هو ليس أن يكون هدفنا عال جداً`,
        ],
        teachers: [
          { name: 'علي صالح', id: '24234234' },
          { name: 'أحمد قاسم', id: '24234234' },
        ],
        requirements: [
          `معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,`,
          `معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,`,
          `معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,`,
          `معظمنا هو ليس أن يكون هدفنا عال جداً, و أن نخفق في تحقيقه,`,
        ],
        status: 'Active',
        sections: [
          {
            name: 'تعلم أساسيات البرمجة',
            lessons: [
              {
                name: 'ما هي البرمجة',
                video: '',
                notes: '',
                description: '',
                file: '',
              },
              {
                name: 'ما هي البرمجة',
                video: '',
                notes: '',
                description: '',
                file: '',
              },
            ],
          },
          {
            name: 'تعلم أساسيات البرمجة',
            lessons: [
              {
                name: 'ما هي البرمجة',
                video: '',
                notes: '',
                description: '',
                file: '',
              },
              {
                name: 'ما هي البرمجة',
                video: '',
                notes: '',
                description: '',
                file: '',
              },
            ],
          },
        ],
      }),

      collage: Factory.extend({
        name: 'Example College',
        fieldsNum: '5',
        describtion:
          'كلية جامعية هي مؤسسة تعليم عالي تقدم تعليماً جامعياً وبرامج بحثية في مجموعة متنوعة من التخصصات الأكاديمية. تعمل الكليات الجامعية على تطوير قدرات الطلاب وتحسين فهمهم في مجالات مختلفة، وتمنح درجات أكاديمية مثل البكالوريوس والماجستير والدكتوراه. تشمل الكليات مجموعة واسعة من الأقسام والتخصصات، وتوفر أيضاً بيئة للبحث العلمي والابتكار. تلعب الكليات الجامعية دورًا مهمًا في تحضير الطلاب لحياتهم المهنية وتسهم في تقدم المعرفة والتطور الاقتصادي والاجتماعي.',
      }),

      subject: Factory.extend({
        name: 'Mathematics',
        subtitle: 'Advanced Calculus',
        kind: 'Management',
        // selected: false,
      }),

      field: Factory.extend({
        name: 'Computer Science',
        semestersNum: '48',
        describtion: 'Computer Science program description.',
        duration: 4,
      }),

      semesterTemplate: Factory.extend({
        name: 'Standard Template',
        subjectsNum: '5',
        order: '1',
      }),
    },

    seeds(server) {
      server.createList('semester', 4)
      server.createList('course', 4)
      server.createList('collage', 4)
      server.createList('subject', 4)
      server.createList('field', 4)
      server.createList('semesterTemplate', 4)
    },
    routes() {
      this.namespace = '/api'

      // Semester CRUD
      this.resource('semesters')
      this.post('/semesters', (schema, request) => {
        try {
          const semesterData = JSON.parse(request.requestBody)

          const newSemester = schema.semesters.create(semesterData)

          return new Response(201, {}, newSemester)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      this.put('/semesters/:id', (schema, request) => {
        try {
          const semesterId = request.params.id
          const semesterData = JSON.parse(request.requestBody)

          const semester = schema.semesters.find(semesterId)

          semester.update(semesterData)
          return new Response(200, {}, semester)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      // Course CRUD
      this.resource('courses')
      this.post('/courses', (schema, request) => {
        try {
          const coursesData = JSON.parse(request.requestBody)

          const newcourses = schema.courses.create(coursesData)

          return new Response(201, {}, newcourses)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      this.put('/courses/:id', (schema, request) => {
        try {
          const coursesId = request.params.id
          const coursesData = JSON.parse(request.requestBody)

          const courses = schema.courses.find(coursesId)

          courses.update(coursesData)
          return new Response(200, {}, courses)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      // Collage CRUD
      this.resource('collages')
      this.post('/collages', (schema, request) => {
        try {
          // Extract data from the request payload
          const newCollageData = JSON.parse(request.requestBody)

          // Create a new collage in the MirageJS database
          const newCollage = schema.collages.create(newCollageData)

          // Return a successful response with the created collage
          return new Response(201, {}, newCollage)
        } catch (error) {
          console.error('Error creating collage:', error)

          // Return an error response
          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })

      this.put('/collages/:id', (schema, request) => {
        try {
          const collageId = request.params.id
          const subjectData = JSON.parse(request.requestBody)
          const subject = schema.collages.find(collageId)

          subject.update(subjectData)
          return new Response(200, {}, subject)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })

      // Subject CRUD
      this.resource('subjects')
      this.post('/subjects', (schema, request) => {
        try {
          const subjectData = JSON.parse(request.requestBody)

          const newsubject = schema.subjects.create(subjectData)

          return new Response(201, {}, newsubject)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      this.put('/subjects/:id', (schema, request) => {
        try {
          const subjectId = request.params.id
          const subjectData = JSON.parse(request.requestBody)

          const subject = schema.subjects.find(subjectId)

          subject.update(subjectData)
          return new Response(200, {}, subject)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      // Field CRUD
      this.resource('fields')
      this.post('/fields', (schema, request) => {
        try {
          const fieldData = JSON.parse(request.requestBody)

          const newfield = schema.fields.create(fieldData)

          return new Response(201, {}, newfield)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      this.put('/fields/:id', (schema, request) => {
        try {
          const fieldId = request.params.id
          const fieldData = JSON.parse(request.requestBody)

          const field = schema.fields.find(fieldId)

          field.update(fieldData)
          return new Response(200, {}, field)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })

      // Semester Template CRUD
      this.resource('semesterTemplates')
      this.post('/semesterTemplates', (schema, request) => {
        try {
          const semesterTemplateData = JSON.parse(request.requestBody)

          const newsemesterTemplate = schema.semesterTemplates.create(semesterTemplateData)

          return new Response(201, {}, newsemesterTemplate)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
      this.put('/semesterTemplates/:id', (schema, request) => {
        try {
          const semesterTemplateId = request.params.id
          const semesterTemplateData = JSON.parse(request.requestBody)

          const semesterTemplate = schema.semesterTemplates.find(semesterTemplateId)

          semesterTemplate.update(semesterTemplateData)
          return new Response(200, {}, semesterTemplate)
        } catch (error) {
          console.error('Error creating collage:', error)

          return new Response(500, {}, { error: 'Internal Server Error' })
        }
      })
    },
  })
  return server
}
