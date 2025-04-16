import { Container, Section, Text, Hr } from '@react-email/components'
import { ApplicationData } from '@/app/(frontend)/(aet-app)/components/FCEApplicationForm/types'
import {
  EVALUATION_SERVICES,
  DELIVERY_OPTIONS,
  ADDITIONAL_SERVICES,
  PURPOSE_OPTIONS,
} from '@/app/(frontend)/(aet-app)/components/FCEApplicationForm/constants'
import { styles } from '../styles/config'

interface CheckoutSummaryCardProps {
  application: ApplicationData
  amount: number
}

export default function CheckoutSummaryCard({ application, amount }: CheckoutSummaryCardProps) {
  const stripeFee = amount * 0.029 + 0.3
  const price = (amount - stripeFee).toFixed(2)

  return (
    <Container>
      {/* Purpose */}
      <Section style={styles.serviceCard.section}>
        <Text style={styles.serviceCard.title}>Purpose:</Text>
        <Container style={styles.serviceCard.indentedContent}>
          <Text style={styles.serviceCard.content}>
            {PURPOSE_OPTIONS.find((o) => o.value === application.purpose)?.label}
          </Text>
        </Container>
      </Section>

      {/* Service Notes */}
      <Section style={styles.serviceCard.section}>
        <Text style={styles.serviceCard.title}>Service Notes:</Text>
        <Container style={styles.serviceCard.indentedContent}>
          <Text style={styles.serviceCard.content}>{application.purposeOther}</Text>
        </Container>
      </Section>

      {/* Customized Service */}
      {application.serviceType?.customizedService?.required && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Customized Service</Text>
          <Container style={styles.serviceCard.indentedContent}>
            <Text style={styles.serviceCard.content}>Price Will Be Quoted Upon Request</Text>
          </Container>
        </Section>
      )}

      {/* Foreign Credential Evaluation */}
      {application.serviceType?.foreignCredentialEvaluation?.firstDegree?.speed && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Educational Foreign Credential Evaluation</Text>
          <Container style={styles.serviceCard.indentedContent}>
            {(() => {
              const speed = application.serviceType.foreignCredentialEvaluation.firstDegree.speed
              const service = speed && EVALUATION_SERVICES.FOREIGN_CREDENTIAL.FIRST_DEGREE[speed]
              return (
                service && (
                  <>
                    <Text style={styles.serviceCard.content}>
                      First Degree: {service.label} - ${service.price}
                    </Text>
                    {application.serviceType.foreignCredentialEvaluation.secondDegrees > 0 && (
                      <Text style={styles.serviceCard.content}>
                        Second Degree:{' '}
                        {application.serviceType.foreignCredentialEvaluation.secondDegrees} × $
                        {speed === '7day'
                          ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
                          : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price}{' '}
                        - $
                        {(speed === '7day'
                          ? EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE['7day'].price
                          : EVALUATION_SERVICES.FOREIGN_CREDENTIAL.SECOND_DEGREE.DEFAULT.price) *
                          application.serviceType.foreignCredentialEvaluation.secondDegrees}
                      </Text>
                    )}
                  </>
                )
              )
            })()}
          </Container>
        </Section>
      )}

      {/* Course by Course */}
      {application.serviceType?.coursebyCourse?.firstDegree?.speed && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Course-by-course Evaluation</Text>
          <Container style={styles.serviceCard.indentedContent}>
            {(() => {
              const speed = application.serviceType.coursebyCourse.firstDegree.speed
              const service = speed && EVALUATION_SERVICES.COURSE_BY_COURSE.FIRST_DEGREE[speed]
              return (
                service && (
                  <>
                    <Text style={styles.serviceCard.content}>
                      First Degree: {service.label} - ${service.price}
                    </Text>
                    {application.serviceType.coursebyCourse.secondDegrees > 0 && (
                      <Text style={styles.serviceCard.content}>
                        Second Degree: {application.serviceType.coursebyCourse.secondDegrees} × $
                        {speed === '8day'
                          ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
                          : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price}{' '}
                        - $
                        {(speed === '8day'
                          ? EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE['8day'].price
                          : EVALUATION_SERVICES.COURSE_BY_COURSE.SECOND_DEGREE.DEFAULT.price) *
                          application.serviceType.coursebyCourse.secondDegrees}
                      </Text>
                    )}
                  </>
                )
              )
            })()}
          </Container>
        </Section>
      )}

      {/* Expert Opinion Letter */}
      {application.serviceType?.professionalExperience?.speed && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Expert Opinion Letter</Text>
          <Container style={styles.serviceCard.indentedContent}>
            <Text style={styles.serviceCard.content}>
              {(() => {
                const speed = application.serviceType.professionalExperience.speed
                const service = speed && EVALUATION_SERVICES.PROFESSIONAL_EXPERIENCE[speed]
                return service ? `${service.label} - $${service.price}` : null
              })()}
            </Text>
          </Container>
        </Section>
      )}

      {/* Position Evaluation */}
      {application.serviceType?.positionEvaluation?.speed && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Position Evaluation</Text>
          <Container style={styles.serviceCard.indentedContent}>
            <Text style={styles.serviceCard.content}>
              {(() => {
                const speed = application.serviceType.positionEvaluation.speed
                const service = speed && EVALUATION_SERVICES.POSITION[speed]
                return service ? `${service.label} - $${service.price}` : null
              })()}
            </Text>
          </Container>
        </Section>
      )}

      {/* Translation Service */}
      {application.serviceType?.translation?.required && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Translation Service</Text>
          <Container style={styles.serviceCard.indentedContent}>
            <Text style={styles.serviceCard.content}>Price Will Be Quoted Upon Request</Text>
          </Container>
        </Section>
      )}

      {/* Type of Delivery */}
      {application.deliveryMethod && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Type of Delivery</Text>
          <Container style={styles.serviceCard.indentedContent}>
            <Text style={styles.serviceCard.content}>
              {(() => {
                const method = application.deliveryMethod
                const service = method && DELIVERY_OPTIONS[method as keyof typeof DELIVERY_OPTIONS]
                return service
                  ? `${service.label} - $${service.price.toFixed(2)}`
                  : 'No Delivery Needed - Free'
              })()}
            </Text>
          </Container>
        </Section>
      )}

      {/* Additional Services */}
      {application.additionalServices?.length > 0 && (
        <Section style={styles.serviceCard.section}>
          <Text style={styles.serviceCard.title}>Additional Services</Text>
          <Container style={styles.serviceCard.indentedContent}>
            {application.additionalServices.map((serviceId) => {
              const service = ADDITIONAL_SERVICES[serviceId]
              if (service) {
                if (serviceId === 'extra_copy' && 'quantity' in service) {
                  const quantity = application.additionalServicesQuantity.extra_copy
                  return (
                    <Text key={serviceId} style={styles.serviceCard.content}>
                      {service.label} × {quantity} - ${(service.price * quantity).toFixed(2)}
                    </Text>
                  )
                } else {
                  return (
                    <Text key={serviceId} style={styles.serviceCard.content}>
                      {service.label} - ${service.price.toFixed(2)}
                    </Text>
                  )
                }
              }
              return null
            })}
          </Container>
        </Section>
      )}

      <Section style={styles.serviceCard.section}>
        <Text style={styles.serviceCard.totalPrice}>
          Price: ${price} + Stripe Fee: ${stripeFee.toFixed(2)}
        </Text>
      </Section>
      <Hr style={styles.serviceCard.divider} />

      {/* Total Price */}
      <Section style={styles.serviceCard.section}>
        <Text style={styles.serviceCard.totalPrice}>Payment Amount: ${amount}</Text>
      </Section>
    </Container>
  )
}
