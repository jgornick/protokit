require 'rake'

PROTOKIT_NAME = 'protokit'
PROTOKIT_VERSION = '0.1'

PROTOKIT_ROOT = File.expand_path(File.dirname(__FILE__))
PROTOKIT_SRC_DIR = File.join(PROTOKIT_ROOT, 'src')
PROTOKIT_DIST_DIR = File.join(PROTOKIT_ROOT, 'dist')

PROTOKIT_DIST_FILE = File.join(PROTOKIT_DIST_DIR, "#{PROTOKIT_NAME}.js")
PROTOKIT_DIST_FILE_PACK = File.join(PROTOKIT_DIST_DIR, "#{PROTOKIT_NAME}-pack.js")

# Add custom String methods to get an array of lines and to strip the whitespace
# after each line.
class String
  def lines
    split $/
  end
  
  def strip_whitespace_at_line_ends
    lines.map {|line| line.gsub(/\s+$/, '')} * $/
  end
end

# Set our default task to forward to the dist task.
task :default => :dist

# The dist task builds and packs protokit.
desc "Builds and packs the ProtoKit distribution"
task :dist => [:build, :pack]

desc "Concats source files and builds protokit.js"
task :build do
  require 'erb'
  
  # Build our list of source files in order of which to build.
  src_files = [
    'protokit',
    'array',
    'class',
    'date',
    'element',
    'dimensions',
    'form',
    'function',
    'string',
    'cookie',
    'customevents',
    'uri',
    'version'
  ].map { |s| File.join(PROTOKIT_SRC_DIR, "#{s}.js") } # Add the source directory
  
  # Insert our header file at the beginning of the array.
  src_files.insert(0, File.join(PROTOKIT_SRC_DIR, 'HEADER'))
   
  # Delete the existing protokit.js
  File.delete(PROTOKIT_DIST_FILE)
  
  # Open a new protokit.js with read/write
  protokitfile = File.open(PROTOKIT_DIST_FILE, 'w+')
  
  # Loop through each source file
  src_files.each do |filename|
    # Replace any template variables in the file and replace them with values locally
    template = ERB.new(File.read(filename))
    protokitfile.puts(template.result(binding).strip_whitespace_at_line_ends)
    
    # Add an extra line after each file
    protokitfile.puts("\n")
  end
  
  protokitfile.close
end

desc "Packs protokit.js using PackR"
task :pack => :build do
  require 'packr'
  
  # Delete any existing packed file
  File.delete(PROTOKIT_DIST_FILE_PACK)
  
  # Open the packed file with read/write
  protokitpacked = File.open(PROTOKIT_DIST_FILE_PACK, 'w+')
  
  # First, add the HEADER file
  protokitpacked.puts(ERB.new(File.read(File.join(PROTOKIT_SRC_DIR, 'HEADER'))).result(binding))
  
  # Lastly, pack the protokit.js file and add it to the packed file
  protokitpacked.puts(Packr.new.pack(File.read(PROTOKIT_DIST_FILE), :base62 => true, :shrink_vars => true))
  
  protokitpacked.close
end