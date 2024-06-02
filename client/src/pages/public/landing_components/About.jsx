import { Text, Container, Anchor, MediaQuery, Button, Image, Title } from '@mantine/core'
import { MdOutlineArrowDownward } from 'react-icons/md'
import { Link } from 'react-scroll'
import logo from '../../../assets/brand/Logo.svg'
import { Link as RouterLink } from 'react-router-dom'

const About = () => {
  //const theme = useMantineTheme();

  return (
    <section id="about">
      <Container fluid>
        <div className="about-content">
          <div style={{ marginBottom: 15 }}>
            <Text>
              <MediaQuery query="(max-width: 768px)" styles={{ fontSize: '2.8rem !important' }}>
                <h1 className="title">
                  {' '}
                  <Text color="brand">جهبذ</Text>منصة تعلم عن بعد متكاملة
                </h1>
              </MediaQuery>
            </Text>
          </div>

          <div style={{ marginBottom: 25 }}>
            <Text size="xl" color="black">
              منصة سحابية متكاملة مصممة بأحدث التقنيات لإدراة العملية التعلمية في المؤسسات التعليمية
              {/* <Anchor href="https://mantine.dev/">Mantine</Anchor>. */}
            </Text>
          </div>

          <div className="buttons">
            <Link to="section-one" smooth duration={500}>
              <Button rightIcon={<MdOutlineArrowDownward size={16} />} size="md">
                معرفة المزيد
              </Button>
            </Link>
            <RouterLink to={'/register'}>
              <Button variant="default" size="md">
                إنشاء حساب
              </Button>
            </RouterLink>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default About
