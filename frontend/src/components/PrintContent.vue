<template>
  <v-dialog v-model="dialog" width="800px">
    <v-card>
      <v-card-text v-html="content" ref="printContent"></v-card-text>
      <v-card-actions>
        <v-btn @click="saveImage" color="primary">DOWNLOAD</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default {
  name: "PrintContent",
  tag: "print-content",
  props: {
    element: String,
    title: String,
  },
  data: () => ({
    content: null,
    dialog: false,
  }),
  created() {
    const element = window.document.getElementById(this.element);
    this.content = `<html lang="pt_BR"><head><title>${this.title}</title></head><body>${element.innerHTML}</body></html>`;
    this.dialog = true;
  },

  methods: {
    async saveImage() {
      const doc = new jsPDF({
        orientation: "p",
        unit: "px",
        format: "a4",
        hotfixes: ["px_scaling"],
      });
      console.log(this.$refs);
      const el = this.$refs.printContent; // You have to call $el if your ref is Vue component
      console.log(el);
      const canvas = await html2canvas(el, {
        width: doc.internal.pageSize.getWidth(),
        height: doc.internal.pageSize.getHeight(),
      });
      console.log(canvas);
      const img = canvas.toDataURL("image/png");
      doc.addImage(
        img,
        "PNG",
        140,
        10,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight()
      );
      doc.save("p&lstatement.pdf");
    },
  },
};
</script>

<style scoped></style>
