"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";

interface CoverLetterPDFProps {
  coverLetter: any;
  settings: any;
  isPDF: boolean;
}

const createDefaultStyles = (settings: any) => {
  const { fontSize, fontFamily, themeColor, spacing } = settings;
  const fontFamilyValue = ENGLISH_FONT_FAMILIES.includes(fontFamily) ? fontFamily : "Roboto";
  const fontSizeValue = parseInt(fontSize) || 11;
  const spacingMultiplier = spacing === 'compact' ? 0.6 : 0.8; // Ridotto per PDF più compatto

  return StyleSheet.create({
    page: {
      fontSize: fontSizeValue,
      fontFamily: fontFamilyValue,
      padding: 40, // Allineato al render HTML
      lineHeight: 1.5, // Allineato al render HTML
      color: '#2d3748',
      backgroundColor: '#ffffff',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30, // Allineato all'HTML (30pt)
      paddingBottom: 16, // Allineato all'HTML (16pt)
      borderBottomWidth: 2,
      borderBottomColor: themeColor,
      borderBottomStyle: 'solid',
    },
    nameSection: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    name: {
      fontSize: fontSizeValue + 8, // Allineato all'HTML (+4pt rispetto al base, in @react-pdf differenza di ~8)
      fontWeight: 'bold',
      marginBottom: 8, // Allineato all'HTML (8pt)
      color: themeColor, // Allineato all'HTML: nome con colore del tema
      lineHeight: 1.2, // Allineato all'HTML
    },
    title: {
      fontSize: fontSizeValue + 1, // Ripristinato per essere identico al render HTML
      color: themeColor,
      fontWeight: 'medium',
      lineHeight: 1.3, // Sincronizzato con render HTML
    },
    contact: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontSize: fontSizeValue - 1, // Allineato all'HTML (-1pt)
      color: '#718096',
      flex: '0 0 auto',
    },
    contactItem: {
      marginBottom: 4, // Allineato all'HTML (4pt)
      textAlign: 'right',
    },
    date: {
      fontSize: fontSizeValue - 1,
      color: '#718096',
      marginBottom: 20, // Allineato all'HTML (20pt)
    },
    companyInfo: {
      marginBottom: 20, // Allineato all'HTML (20pt)
    },
    companyName: {
      fontSize: fontSizeValue + 1,
      fontWeight: 'semibold',
      color: '#2d3748', // Nome azienda con colore originale
      marginBottom: 2 * spacingMultiplier, // Ridotto da 4
    },
    jobTitle: {
      fontSize: fontSizeValue,
      color: '#4a5568',
      marginBottom: 12 * spacingMultiplier, // Ridotto da 16
    },
    greeting: {
      fontSize: fontSizeValue,
      fontWeight: 'medium',
      color: '#2d3748',
      marginBottom: 20, // Allineato all'HTML (20pt)
    },
    paragraph: {
      fontSize: fontSizeValue - 0.5,
      lineHeight: 1.5, // Allineato al render HTML
      textAlign: 'justify',
      marginBottom: 8 * spacingMultiplier, // Ridotto da 12
    },
    content: {
      fontSize: fontSizeValue,
      lineHeight: 1.5, // Allineato al render HTML
      textAlign: 'justify',
      marginBottom: 16 * spacingMultiplier,
    },
    closing: {
      fontSize: fontSizeValue,
      fontWeight: 'medium',
      color: '#2d3748',
      marginTop: 16 * spacingMultiplier, // Ridotto da 20
      marginBottom: 4 * spacingMultiplier, // Ridotto da 8
    },
    signature: {
      fontSize: fontSizeValue + 1,
      fontWeight: 'semibold',
      color: themeColor, // Firma con colore del tema
    },
  });
};

export const CoverLetterDefaultPDF = ({ coverLetter, settings, isPDF }: CoverLetterPDFProps) => {
  const styles = createDefaultStyles(settings);
  const { profile, content } = coverLetter;

  // Converti i dati nel nuovo formato per consistenza
  const coverLetterData = {
    personal: {
      name: profile.name,
      title: profile.position || "",
      email: profile.email,
      phone: profile.phone,
      website: profile.location || "website.com"
    },
    company: {
      name: profile.company,
      jobTitle: profile.position
    },
    content: {
      greeting: profile.hiringManager || "Dear Hiring Manager,",
      body: content && content.length > 0
        ? content
            // Dividi i paragrafi su due newline per preservare i paragrafi vuoti inseriti dall'utente
            .split(/\r?\n\r?\n/)
            // Non trim, preserva spazi iniziali/finali; normalizza newline singoli all'interno del paragrafo
            .map((p: string) => p.replace(/\r?\n/g, "\n"))
            // Preserva sequenze di spazi convertendoli in non-breaking spaces
            .map((p: string) => p.replace(/ {2,}/g, (m: string) => "\u00A0".repeat(m.length)))
        : [
            "Scrivo per esprimere il mio forte interesse per la posizione di " +
              (profile.position || "[posizione]") +
              " presso " +
              (profile.company || "[azienda]") +
              "."
          ],
      closing: profile.closing || "Kind Regards,"
    },
    date: profile.date || new Date().toLocaleDateString('it-IT')
  };

  return (
    <Document
      title={`${coverLetterData.personal.name} - Cover Letter`}
      producer={"cv---maker"}
      creator={"cv---maker"}
    >
      <Page size={settings.documentSize} style={styles.page}>
        {/* Header con layout flexbox e linea di separazione */}
        <View style={styles.header}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{coverLetterData.personal.name}</Text>
            {coverLetterData.personal.title && (
              <Text style={styles.title}>{coverLetterData.personal.title}</Text>
            )}
          </View>
          <View style={styles.contact}>
            <Text style={styles.contactItem}>{coverLetterData.personal.email}</Text>
            <Text style={styles.contactItem}>{coverLetterData.personal.phone}</Text>
            {coverLetterData.personal.website && (
              <Text style={styles.contactItem}>{coverLetterData.personal.website}</Text>
            )}
          </View>
        </View>

        {/* Data */}
        <Text style={styles.date}>{coverLetterData.date}</Text>

        {/* Nome azienda sopra il contenuto */}
        {coverLetterData.company.name && (
          <Text style={styles.companyName}>{coverLetterData.company.name}</Text>
        )}

        {/* Contenuto lettera */}
        <Text style={styles.greeting}>{coverLetterData.content.greeting}</Text>
        
        {coverLetterData.content.body.map((paragraph: string, index: number) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <Text style={styles.closing}>{coverLetterData.content.closing}</Text>
        <Text style={styles.signature}>{coverLetterData.personal.name}</Text>
      </Page>
    </Document>
  );
};
