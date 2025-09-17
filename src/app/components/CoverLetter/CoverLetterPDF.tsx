"use client";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { useAppSelector } from "lib/redux/hooks";
import { selectCoverLetter } from "lib/redux/coverLetterSlice";
import { selectSettings } from "lib/redux/settingsSlice";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { CoverLetterDefaultPDF } from "./CoverLetterDefaultPDF";

interface CoverLetterPDFProps {
  coverLetter: any;
  settings: any;
  isPDF: boolean;
}

const createMinimalStyles = (settings: any) => {
  const { fontSize, fontFamily, themeColor, spacing } = settings;
  const fontFamilyValue = ENGLISH_FONT_FAMILIES.includes(fontFamily) ? fontFamily : "Roboto";
  const fontSizeValue = parseInt(fontSize) || 11;
  const spacingMultiplier = spacing === 'compact' ? 0.6 : 0.8; // Ridotto per PDF più compatto

  return StyleSheet.create({
    page: {
      fontSize: fontSizeValue,
      fontFamily: fontFamilyValue,
      padding: 40 * spacingMultiplier, // Allineato al tema minimal HTML
      color: '#2d3748',
      backgroundColor: '#ffffff',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24 * spacingMultiplier, // Allineato a minimal HTML
      paddingBottom: 16 * spacingMultiplier, // Allineato a minimal HTML
    },
    nameSection: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    name: {
      fontSize: fontSizeValue + 8,
      fontWeight: 'bold',
      marginBottom: 4 * spacingMultiplier, // Allineato a minimal HTML
      color: '#0F172A',
      lineHeight: 1.2,
    },
    title: {
      fontSize: fontSizeValue + 1,
      color: '#64748B',
      fontWeight: 'medium',
      lineHeight: 1.3,
    },
    contact: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontSize: fontSizeValue - 2, // Allineato a minimal HTML
      color: '#718096',
      flex: '0 0 auto',
    },
    contactItem: {
      marginBottom: 2 * spacingMultiplier, // Allineato a minimal HTML
      textAlign: 'right',
    },
    date: {
      fontSize: fontSizeValue - 1,
      color: '#718096',
      marginBottom: 16 * spacingMultiplier, // Allineato a minimal HTML
    },
    companyInfo: {
      marginBottom: 16 * spacingMultiplier, // Ridotto da 20
    },
    companyName: {
      fontSize: fontSizeValue + 1,
      fontWeight: 'semibold',
      color: '#1E293B',
      marginBottom: 4 * spacingMultiplier, // Allineato a minimal HTML
    },
    jobTitle: {
      fontSize: fontSizeValue,
      color: '#4a5568',
      marginBottom: 16 * spacingMultiplier, // Allineato a minimal HTML
    },
    greeting: {
      fontSize: fontSizeValue,
      fontWeight: 'medium',
      color: '#2d3748',
      marginBottom: 12 * spacingMultiplier, // Allineato a minimal HTML
    },
    paragraph: {
      fontSize: fontSizeValue - 0.5,
      lineHeight: 1.6, // Allineato a minimal HTML
      textAlign: 'justify',
      marginBottom: 12 * spacingMultiplier, // Allineato a minimal HTML
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
      color: '#0F172A', // Firma con colore del tema minimal
    },
  });
};

export const CoverLetterPDF = ({ coverLetter, settings, isPDF }: CoverLetterPDFProps) => {
  const coverLetterTheme = settings.coverLetterTheme || "default";
  
  if (coverLetterTheme === "default") {
    return <CoverLetterDefaultPDF coverLetter={coverLetter} settings={settings} isPDF={isPDF} />;
  }
  
  // Tema minimal
  const styles = createMinimalStyles(settings);
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
            .split(/\r?\n\r?\n/)
            .map((p: string) => p.replace(/\r?\n/g, "\n"))
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
        {/* Header senza linea di separazione */}
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
