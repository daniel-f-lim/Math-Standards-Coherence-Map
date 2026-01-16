
import { Standard, ClusterInfo } from '../types';

export async function fetchStandards(): Promise<{ standards: Standard[], clusters: ClusterInfo[] }> {
  // Full set of 23 Kindergarten standards as requested
  const standards: Standard[] = [
    { Code: "K.CC.1", Description: "Count to 100 by ones and by tens.", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Know number names and the count sequence.", Dependencies: "" },
    { Code: "K.CC.2", Description: "Count forward beginning from a given number within the known sequence (instead of having to begin at 1).", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Know number names and the count sequence.", Dependencies: "K.CC.1" },
    { Code: "K.CC.3", Description: "Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Know number names and the count sequence.", Dependencies: "K.CC.1" },
    { Code: "K.CC.4", Description: "Understand the relationship between numbers and quantities; connect counting to cardinality.", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Count to tell the number of objects.", Dependencies: "K.CC.1 | K.CC.2 | K.CC.3" },
    { Code: "K.CC.5", Description: "Count to tell 'how many?' objects arranged in a line, a rectangular array, or a circle, or as many as 20 objects in a scattered configuration; given a number from 1-20, count out that many objects.", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Count to tell the number of objects.", Dependencies: "K.CC.4" },
    { Code: "K.CC.6", Description: "Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Compare numbers.", Dependencies: "K.CC.5" },
    { Code: "K.CC.7", Description: "Compare two numbers between 1 and 10 presented as written numerals.", Domain: "Counting and Cardinality", Grade: "Kindergarten", Cluster: "Compare numbers.", Dependencies: "K.CC.3 | K.CC.6" },
    { Code: "K.OA.1", Description: "Represent addition and subtraction with objects, fingers, mental images, drawings, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.", Domain: "Operations and Algebraic Thinking", Grade: "Kindergarten", Cluster: "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.", Dependencies: "K.CC.4 | K.CC.5" },
    { Code: "K.OA.2", Description: "Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.", Domain: "Operations and Algebraic Thinking", Grade: "Kindergarten", Cluster: "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.", Dependencies: "K.OA.1" },
    { Code: "K.OA.3", Description: "Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).", Domain: "Operations and Algebraic Thinking", Grade: "Kindergarten", Cluster: "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.", Dependencies: "K.OA.1" },
    { Code: "K.OA.4", Description: "For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.", Domain: "Operations and Algebraic Thinking", Grade: "Kindergarten", Cluster: "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.", Dependencies: "K.OA.3" },
    { Code: "K.OA.5", Description: "Fluently add and subtract within 5.", Domain: "Operations and Algebraic Thinking", Grade: "Kindergarten", Cluster: "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.", Dependencies: "K.OA.2" },
    { Code: "K.NBT.1", Description: "Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (such as 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.", Domain: "Number and Operations in Base Ten", Grade: "Kindergarten", Cluster: "Work with numbers 11-19 to gain foundations for place value.", Dependencies: "K.CC.3 | K.CC.5" },
    { Code: "K.MD.1", Description: "Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object.", Domain: "Measurement and Data", Grade: "Kindergarten", Cluster: "Describe and compare measurable attributes.", Dependencies: "" },
    { Code: "K.MD.2", Description: "Directly compare two objects with a measurable attribute in common, to see which object has 'more of'/'less of' the attribute, and describe the difference. For example, directly compare the heights of two children and describe one child as taller/shorter.", Domain: "Measurement and Data", Grade: "Kindergarten", Cluster: "Describe and compare measurable attributes.", Dependencies: "K.MD.1" },
    { Code: "K.MD.3", Description: "Classify objects into given categories; count the numbers of objects in each category and sort the categories by count.", Domain: "Measurement and Data", Grade: "Kindergarten", Cluster: "Classify objects and count the number of objects in each category.", Dependencies: "K.CC.5" },
    { Code: "K.MD.S1", Description: "Collect and represent data in simple graphs.", Domain: "Measurement and Data", Grade: "Kindergarten", Cluster: "Classify objects and count the number of objects in each category.", Dependencies: "K.MD.3" },
    { Code: "K.G.1", Description: "Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.", Domain: "Geometry", Grade: "Kindergarten", Cluster: "Identify and describe shapes.", Dependencies: "" },
    { Code: "K.G.2", Description: "Correctly name shapes regardless of their orientations or overall size.", Domain: "Geometry", Grade: "Kindergarten", Cluster: "Identify and describe shapes.", Dependencies: "K.G.1" },
    { Code: "K.G.3", Description: "Identify shapes as two-dimensional (lying in a plane, 'flat') or three-dimensional ('solid').", Domain: "Geometry", Grade: "Kindergarten", Cluster: "Identify and describe shapes.", Dependencies: "K.G.2" },
    { Code: "K.G.4", Description: "Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts (e.g., number of sides and vertices/'corners') and other attributes (e.g., having sides of equal length).", Domain: "Geometry", Grade: "Kindergarten", Cluster: "Analyze, compare, create, and compose shapes.", Dependencies: "K.G.2" },
    { Code: "K.G.5", Description: "Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.", Domain: "Geometry", Grade: "Kindergarten", Cluster: "Analyze, compare, create, and compose shapes.", Dependencies: "K.G.2" },
    { Code: "K.G.6", Description: "Compose simple shapes to form larger shapes. For example, 'Can you join these two triangles with full sides touching to make a rectangle?'", Domain: "Geometry", Grade: "Kindergarten", Cluster: "Analyze, compare, create, and compose shapes.", Dependencies: "K.G.4 | K.G.5" }
  ];

  const clusters: ClusterInfo[] = [
    { Cluster: "Know number names and the count sequence.", Grade: "Kindergarten", Terminology: "Number names, sequence, ones, tens.", Clarifications: "Oral counting is the foundation." },
    { Cluster: "Count to tell the number of objects.", Grade: "Kindergarten", Terminology: "One-to-one correspondence, cardinality.", Clarifications: "Focus on stable order and abstraction." },
    { Cluster: "Compare numbers.", Grade: "Kindergarten", Terminology: "More, less, same, greater than, less than.", Clarifications: "Use matching and counting strategies." },
    { Cluster: "Understand addition as putting together and adding to, and understand subtraction as taking apart and taking from.", Grade: "Kindergarten", Terminology: "Plus, minus, equal, join, separate.", Clarifications: "Focus on word problems with manipulatives." },
    { Cluster: "Work with numbers 11-19 to gain foundations for place value.", Grade: "Kindergarten", Terminology: "Teen numbers, ten and some more.", Clarifications: "Compose and decompose using equations." },
    { Cluster: "Describe and compare measurable attributes.", Grade: "Kindergarten", Terminology: "Longer, shorter, heavier, lighter.", Clarifications: "Direct comparison is the goal." },
    { Cluster: "Classify objects and count the number of objects in each category.", Grade: "Kindergarten", Terminology: "Sort, category, group.", Clarifications: "Sorting by physical properties." },
    { Cluster: "Identify and describe shapes.", Grade: "Kindergarten", Terminology: "Circle, square, triangle, rectangle, hexagon, cube, cone, cylinder, sphere.", Clarifications: "Identify names and relative positions." },
    { Cluster: "Analyze, compare, create, and compose shapes.", Grade: "Kindergarten", Terminology: "Sides, corners, build, draw.", Clarifications: "Form larger shapes from smaller ones." }
  ];

  return { standards, clusters };
}

export function transformContent(html: string): string {
  if (!html) return '';
  // Apply image prefix for relative paths as requested
  let transformed = html.replace(
    /src=["']images\/(.*?)["']/g, 
    'src="https://storage.googleapis.com/hidoe-math-standards/images/$1"'
  );
  // Ensure okina (ʻ) is preserved (Standard UTF-8)
  return transformed;
}
